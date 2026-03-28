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

  const prevCameraDirections = useRef<Direction[]>([null, null, null, null]);
  //useStateからuseRefへの変更

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let animationFrameId: number;
    let isActive = true; //ロード中にユーザーが画面の遷移をしてしまった場合カメラが起動してしまうバグの修正

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
      if (isActive) startCamera();
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

    const predictWebcam = () => {
      if (!videoRef.current || !faceLandmarker) return;

      const startTimeMs = performance.now();
      const results = faceLandmarker.detectForVideo(
        videoRef.current,
        startTimeMs,
      );

      const currentTimer = useGameStore.getState().calibration_timer;
      const newCameraDirs: Direction[] = [null, null, null, null];
      // レンダリングの原因となるzustandの使用を避ける

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
            // console.log(pitch);

            if (currentTimer === 9) {
              down_standard.current[sectorIndex] = pitch;
            }
            if (currentTimer === 12) {
              up_standard.current[sectorIndex] = pitch;
            }
            if (currentTimer === 15) {
              center_standard.current[sectorIndex] = pitch;
            }

            newCameraDirs[sectorIndex] = dir;
          }
        });
      }

      for (let i = 0; i < 4; i++) {
        // 向きが変わった時だけ再レンダリング
        if (newCameraDirs[i] !== prevCameraDirections.current[i]) {
          setCameraDirections(i, newCameraDirs[i]);
          prevCameraDirections.current[i] = newCameraDirs[i];
        }
      }
      animationFrameId = requestAnimationFrame(predictWebcam);
    };
    setUpDetector();

    return () => {
      isActive = false;
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
