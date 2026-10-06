"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";


interface VoiceRecorderProps {
  memberId: string;
  receiverId: string;
  onUploaded?: (url: string) => void;
}



export default function VoiceRecorder({
  memberId,
  receiverId,
  onUploaded,
}: VoiceRecorderProps) {


  const [recording, setRecording] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);


  const [recorder, setRecorder] =
    useState<MediaRecorder | null>(null);


  const supabase =
    createClient();



  async function startRecording() {

    const stream =
      await navigator.mediaDevices
        .getUserMedia({
          audio: true,
        });


    const mediaRecorder =
      new MediaRecorder(stream);


    const chunks: BlobPart[] = [];


    mediaRecorder.ondataavailable =
      (event) => {

        if (event.data.size > 0) {
          chunks.push(event.data);
        }

      };



    mediaRecorder.onstop =
      async () => {

        const blob =
          new Blob(
            chunks,
            {
              type:
                "audio/webm",
            }
          );


        await uploadVoice(blob);

      };



    mediaRecorder.start();

    setRecorder(mediaRecorder);

    setRecording(true);

  }




  function stopRecording() {

    if (!recorder) return;


    recorder.stop();

    setRecording(false);

  }





  async function uploadVoice(
    blob: Blob
  ) {

    try {

      setUploading(true);



      const fileName =
        `${memberId}/${Date.now()}.webm`;



      const {
        error: uploadError,
      } =
        await supabase
          .storage
          .from("voices")
          .upload(
            fileName,
            blob,
            {
              contentType:
                "audio/webm",
              upsert: false,
            }
          );



      if (uploadError) {

        throw uploadError;

      }



      const {
        data,
      } =
        supabase
          .storage
          .from("voices")
          .getPublicUrl(
            fileName
          );



      const voiceUrl =
        data.publicUrl;



      await fetch(
        "/api/messages/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            sender_id:
              memberId,

            receiver_id:
              receiverId,

            type:
              "voice",

            voice_url:
              voiceUrl,

          }),

        }
      );



      if (onUploaded) {

        onUploaded(
          voiceUrl
        );

      }



    } catch (error) {

      console.error(
        "Voice upload error",
        error
      );


    } finally {

      setUploading(false);

    }

  }




  return (

    <div>

      {
        recording ? (

          <button
            onClick={
              stopRecording
            }
          >
            ⏹ إيقاف التسجيل
          </button>

        ) : (

          <button
            onClick={
              startRecording
            }
          >
            🎤 تسجيل صوت
          </button>

        )
      }


      {
        uploading &&
        <p>
          جاري رفع الصوت...
        </p>
      }


    </div>

  );

}