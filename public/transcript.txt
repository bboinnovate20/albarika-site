  const transcribeAPI = () => {
    const baseUrl = "https://api.assemblyai.com";
    const headers = {

      // Replace with your chosen API key, this is the "default" account api key

      authorization: "08756b65d33543b7a9ccc7f560c1d355",

    };
    const FILE_URL = "https://assemblyaiusercontent.com/playground/tWcifg-zRrd.flac";
    // Request parameters

    const data = {

      audio_url: FILE_URL,

      speaker_labels: true,

      format_text: true,

      punctuate: true,

      speech_model: "universal",

      language_detection: true,

    }

    const url = `${baseUrl}/v2/transcript`;
    const response = await axios.post(url, data, { headers: headers });
    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;
    while (true) {

      const pollingResponse = await axios.get(pollingEndpoint, {

        headers: headers,

      });

      const transcriptionResult = pollingResponse.data;


      if (transcriptionResult.status === "completed") {

        console.log(transcriptionResult.text);
        setRawText(transcriptionResult.text)

        break;

      } else if (transcriptionResult.status === "error") {

        throw new Error(`Transcription failed: ${transcriptionResult.error}`);

      } else {

        await new Promise((resolve) => setTimeout(resolve, 3000));

      }
    }
}

{/* Recording Controls */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Create New Transcription</CardTitle>
            <CardDescription>
              Record live audio or upload existing files. We'll help you get professional transcripts and AI analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Live Recording Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500" />
                  Live Recording
                </h3>
                
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      onClick={() => setIsConsentNeeded(true)}
                      disabled={isRecording || status !== 'idle'}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </Button>
                    
                    {isRecording && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={stopRecording}
                        className="px-6 py-3"
                      >
                        <StopCircle className="w-5 h-5 mr-2" />
                        Stop
                      </Button>
                    )}
                  </div>
                  
                  {isRecording && (
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-red-600 mb-2">
                        {formatTime(recordingTime)}
                      </div>
                      <AudioVisualizer stream={audioStream} isRecording={isRecording} />
                    </div>
                  )}
                  
                  {!isRecording && (
                    <p className="text-sm text-slate-500 text-center">
                      High-quality recording with automatic noise reduction
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-blue-500" />
                  Upload Audio File
                </h3>
                
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={status !== 'idle'}
                    className="px-6 py-3"
                  >
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Choose Audio File
                  </Button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".mp3,.mp4,.wav,.m4a,.webm,audio/*"
                  />
                  
                  <p className="text-sm text-slate-500 text-center">
                    Supports MP3, MP4, WAV, M4A, WebM<br/>
                    Maximum file size: 50MB
                  </p>
                </div>
              </div>
            </div>

            {/* Transcription Workflow Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">🚀 Professional Transcription Workflow</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Step 1:</strong> Record or upload your audio file (saved automatically)</p>
                      <p><strong>Step 2:</strong> Use our recommended free transcription service</p>
                      <p><strong>Step 3:</strong> Paste the transcript back - our AI will analyze, format, and translate</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
                      onClick={() => window.open('https://huggingface.co/spaces/openai/whisper', '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open Free Whisper Tool
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

          // {/* Transcription Workflow Info */}
            // <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            //   <CardContent className="p-6">
            //     <div className="flex items-start gap-4">
            //       <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            //       <div>
            //         <h4 className="font-semibold text-blue-900 mb-2">🚀 Professional Transcription Workflow</h4>
            //         <div className="space-y-2 text-sm text-blue-800">
            //           <p><strong>Step 1:</strong> Record or upload your audio file (saved automatically)</p>
            //           <p><strong>Step 2:</strong> Use our recommended free transcription service</p>
            //           <p><strong>Step 3:</strong> Paste the transcript back - our AI will analyze, format, and translate</p>
            //         </div>
            //         <Button
            //           variant="outline"
            //           size="sm"
            //           className="mt-3 text-blue-700 border-blue-300 hover:bg-blue-100"
            //           onClick={() => window.open('https://huggingface.co/spaces/openai/whisper', '_blank')}
            //         >
            //           <ExternalLink className="w-4 h-4 mr-1" />
            //           Open Free Whisper Tool
            //         </Button>
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>

 {/* Interactive Transcript */}
                    // <InteractiveTranscript
                    //   segments={segments}
                    //   audioRef={audioRef}
                    //   isPlaying={isPlaying}
                    //   currentTime={currentTime}
                    //   onSegmentEdit={handleSegmentEdit}
                    //   displayLanguage={displayLanguage} />