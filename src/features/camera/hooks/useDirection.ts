import React, { useEffect, useRef } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useGameStore } from "../../../zustand";
import { type Direction } from "../../../zustand";

const useDirection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setCameraDirections = useGameStore(
    (state) => state.setCameraDirections,
  );

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
        numFaces: 3, // 検出人数をに設定
      });
      startCamera();
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

    const newSayuus = [0, 0, 0];
    const newJoges = [0, 0, 0];

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

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        results.faceLandmarks.forEach((landmarks, index) => {
          // 顔の基準点として鼻の頭付近のX座標を取得 (0.0 〜 1.0)
          const faceX = landmarks[1].x;

          // videoタグで scaleX(-1)（左右反転）しているため、
          // 画面の左側（見た目）が、カメラのデータ上では 1.0 に近くなる。
          // 画面の左から 0, 1, 2, 3 のインデックスになるように座標を反転させます。
          const screenX = 1.0 - faceX;

          // 画面を4分割し、どの領域(0〜3)にいるか計算
          let sectorIndex = Math.floor(screenX * 3);
          // 画面端で見切れた場合の安全対策
          if (sectorIndex < 0) sectorIndex = 0;
          if (sectorIndex > 2) sectorIndex = 2;

          // その顔の回転行列を取得
          const matrix = results.facialTransformationMatrixes?.[index]?.data;
          if (matrix) {
            const yaw = matrix[2];
            const pitch = matrix[6];

            let dir: Direction = "center";
            // ※閾値はまた決める
            if (yaw > 0.4) dir = "right";
            else if (yaw < -0.4) dir = "left";
            else if (pitch > 0.2) dir = "down";
            else if (pitch < -0.2) dir = "up";

            // 計算したエリア（インデックス）の方向を上書き
            setCameraDirections(sectorIndex, dir);
            newJoges[sectorIndex] = pitch;
            newSayuus[sectorIndex] = yaw;
          }
        });
      }

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
};

export default useDirection;
