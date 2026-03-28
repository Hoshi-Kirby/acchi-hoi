import { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useGameStore } from "../../../zustand";
import { type Direction } from "../../../zustand";

const useDirection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  //   const [directions, setDirections] = useState<string[]>(["無", "無", "無"]);
  // const [sayuu, setSayuu] = useState<number[]>([0, 0, 0, 0]);
  // const [joge, setJoge] = useState<number[]>([0, 0, 0, 0]);
  //   const cameraDirections = useGameStore((state) => state.cameraDirections);
  const setCameraDirections = useGameStore(
    (state) => state.setCameraDirections,
  );
  const playerCount = useGameStore((state) => state.playerCount); //キャリブレーションをもとに変化するはん
  const down_standard = useRef<number[]>([0.4, 0.4, 0.4, 0.4]);
  const up_standard = useRef<number[]>([0.4, 0.4, 0.4, 0.4]);
  const center_standard = useRef<number[]>([0.4, 0.4, 0.4, 0.4]);

  const calibration_timer = useGameStore((state) => state.calibration_timer);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let animationFrameId: number;
    const setUpDetector = async () => {
      //モデルの初期化
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFacialTransformationMatrixes: true,
        runningMode: "VIDEO",
        numFaces: playerCount, // 検出人数をに設定
      });
      startCamera();
      console.log("初期化完了");
    };
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (error) {
        console.error("カメラの取得に失敗しました。", error);
      }
    };

    const newSayuus = [0, 0, 0, 0];
    const newJoges = [0, 0, 0, 0];

    const predictWebcam = () => {
      if (!videoRef.current || !faceLandmarker) return;

      const startTimeMs = performance.now();
      const results = faceLandmarker.detectForVideo(
        videoRef.current,
        startTimeMs,
      );
      // 毎フレーム「無」でリセットし、顔が見つかったエリアだけ上書きする
      setCameraDirections(0, null);
      setCameraDirections(1, null);
      setCameraDirections(2, null);
      setCameraDirections(3, null);
      if (results.faceLandmarks.length > 0) {
        results.faceLandmarks.forEach((landmarks, index) => {
          // 顔の基準点として鼻の頭付近のX座標を取得 (0.0 〜 1.0)
          const faceX = landmarks[1].x;

          // videoタグで scaleX(-1)（左右反転）しているため、
          // 画面の左側（見た目）が、カメラのデータ上では 1.0 に近くなる。
          // 画面の左から 0, 1, 2, 3 のインデックスになるように座標を反転させます。
          const screenX = 1.0 - faceX;
          // 画面を4分割し、どの領域(0〜3)にいるか計算
          let sectorIndex = Math.floor(screenX * playerCount);
          // 画面端で見切れた場合の安全対策
          if (sectorIndex < 0) sectorIndex = 0;
          if (sectorIndex > playerCount - 1) sectorIndex = playerCount - 1;

          // その顔の回転行列を取得
          const matrix = results.facialTransformationMatrixes?.[index]?.data;
          if (matrix) {
            const yaw = matrix[2];
            const pitch = matrix[6];
            let dir: Direction = "center";
            // ※閾値はまた決める
            if (yaw > 0.4) dir = "right";
            else if (yaw < -0.4) dir = "left";
            else if (
              pitch >
              0.3 * down_standard.current[sectorIndex] +
                0.6 * center_standard.current[sectorIndex]
            )
              dir = "down";
            else if (
              pitch <
              0.1 * up_standard.current[sectorIndex] +
                0.1 * center_standard.current[sectorIndex]
            )
              dir = "up";
            console.log(pitch);

            if (calibration_timer === 9) {
              down_standard.current[sectorIndex] = yaw;
            }
            if (calibration_timer === 12) {
              up_standard.current[sectorIndex] = yaw;
            }
            if (calibration_timer === 15) {
              center_standard.current[sectorIndex] = yaw;
            }

            // 計算したエリア（インデックス）の方向を上書き
            setCameraDirections(sectorIndex, dir);

            newJoges[sectorIndex] = pitch;
            newSayuus[sectorIndex] = yaw;
          }
        });
      }

      // setSayuu(newSayuus);
      // setJoge(newJoges);
      animationFrameId = requestAnimationFrame(predictWebcam);
    };
    setUpDetector();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (faceLandmarker) {
        faceLandmarker.close();
      }
    };
  }, []);
  return { videoRef };
};

export default useDirection;
