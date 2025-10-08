import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Transcription } from '@/entities/Transcription';
import { UploadPrivateFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mic, StopCircle, Loader2, FileAudio, UploadCloud, Info, CheckCircle, Play, Pause, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const ConsentDialog = ({ onConfirm, onCancel }) => (
  <Dialog open={true} onOpenChange={onCancel}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Recording Consent & Agreement</DialogTitle>
        <DialogDescription className="space-y-2">
          <p>Before starting the recording, please confirm:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>You have obtained consent from all participants</li>
            <li>Recording is legally permitted in your jurisdiction</li>
            <li>The content will be uploaded and processed by AI</li>
            <li>You understand the recording will be saved securely</li>
          </ul>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
          I Consent, Start Recording
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const AudioVisualizer = ({ stream, isRecording }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!stream || !canvasRef.current || !isRecording) {
      // Clear canvas when not recording
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.fillStyle = '#f1f5f9';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas with light background
      canvasCtx.fillStyle = '#f8fafc';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * (canvas.height * 0.8);
        
        // Create gradient for bars
        const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#3b82f6'); // blue-500
        gradient.addColorStop(1, '#1d4ed8'); // blue-700
        
        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      audioContext.close();
    };
  }, [stream, isRecording]);

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <canvas ref={canvasRef} width="400" height="100" className="rounded-lg w-full max-w-md" />
    </div>
  );
};

const RecordingClips = ({ recordings, onPlay, currentlyPlaying }) => {
  if (recordings.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileAudio className="w-5 h-5" />
          Session Recordings ({recordings.length})
        </CardTitle>
        <CardDescription>
          Recordings from this session. Click to play or download.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recordings.map((recording, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPlay(recording, index)}
                className="flex-shrink-0"
              >
                {currentlyPlaying === index ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 truncate">
                  Recording {index + 1}
                </p>
                <p className="text-xs text-slate-500">
                  {recording.duration}s • {recording.format.toUpperCase()}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = recording.url;
                  a.download = recording.filename;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const TranscriptionCard = ({ transcription }) => {
  const navigate = useNavigate();
  
  const getStatusInfo = () => {
    switch(transcription.status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-800', text: 'Analyzed', icon: CheckCircle };
      case 'processing':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Needs Transcript', icon: Loader2 };
      case 'failed':
        return { color: 'bg-red-100 text-red-800', text: 'Failed', icon: Info };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Unknown', icon: Info };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md"
      onClick={() => navigate(createPageUrl(`AITranscribeView?id=${transcription.id}`))}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 mb-1 truncate">
              {transcription.title}
            </h3>
            <p className="text-sm text-slate-500 mb-3">
              {format(new Date(transcription.created_date), 'MMM dd, yyyy • h:mm a')}
            </p>
            {transcription.summary && (
              <p className="text-sm text-slate-600 line-clamp-2">
                {transcription.summary}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <Badge className={statusInfo.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </Badge>
            <FileAudio className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AITranscribePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isConsentNeeded, setIsConsentNeeded] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, recording, uploading, processing
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Audio states
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [sessionRecordings, setSessionRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  // Data states
  const [transcriptions, setTranscriptions] = useState([]);
  const [isLoadingTranscriptions, setIsLoadingTranscriptions] = useState(true);
  
  // Refs
  const audioChunks = useRef([]);
  const recordingTimer = useRef(null);
  const fileInputRef = useRef(null);

  const fetchTranscriptions = useCallback(async () => {
    setIsLoadingTranscriptions(true);
    try {
      const data = await Transcription.list('-created_date');
      setTranscriptions(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load transcriptions.", variant: "destructive" });
    } finally {
      setIsLoadingTranscriptions(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTranscriptions();
  }, [fetchTranscriptions]);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimer.current);
      setRecordingTime(0);
    }
    
    return () => clearInterval(recordingTimer.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBestAudioFormat = () => {
    // Try formats in order of preference for transcription compatibility
    const formats = [
      { type: 'audio/mp4', ext: 'mp4' },
      { type: 'audio/mpeg', ext: 'mp3' },
      { type: 'audio/wav', ext: 'wav' },
      { type: 'audio/webm; codecs=opus', ext: 'webm' },
      { type: 'audio/webm', ext: 'webm' }
    ];

    for (const format of formats) {
      if (MediaRecorder.isTypeSupported(format.type)) {
        console.log(`Using audio format: ${format.type}`);
        return format;
      }
    }

    console.warn('No preferred format supported, using default');
    return { type: 'audio/webm', ext: 'webm' };
  };

  const startRecording = async () => {
    setIsConsentNeeded(false);
    setStatus('recording');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1
        } 
      });
      
      setAudioStream(stream);
      
      const audioFormat = getBestAudioFormat();
      const recorder = new MediaRecorder(stream, { 
        mimeType: audioFormat.type,
        audioBitsPerSecond: 128000
      });
      
      setMediaRecorder(recorder);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };
      
      recorder.onstop = () => handleRecordingStop(audioFormat);
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast({ 
          title: "Recording Error", 
          description: "Failed to record audio. Please check your microphone permissions.", 
          variant: "destructive" 
        });
        stopRecording();
      };

      // Start recording with data collection every second
      recorder.start(1000);
      setIsRecording(true);
      
      toast({ 
        title: "🎙️ Recording Started", 
        description: `High-quality ${audioFormat.ext.toUpperCase()} recording in progress...`
      });
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({ 
        title: "Microphone Access Denied", 
        description: "Please allow microphone access and try again.", 
        variant: "destructive" 
      });
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const handleRecordingStop = async (audioFormat) => {
    if (audioChunks.current.length === 0) {
      toast({ title: "No Audio Data", description: "No audio was recorded.", variant: "destructive" });
      setStatus('idle');
      return;
    }

    setStatus('uploading');
    
    try {
      const audioBlob = new Blob(audioChunks.current, { type: audioFormat.type });
      const duration = recordingTime;
      const timestamp = format(new Date(), 'yyyy-MM-dd HHmm');
      const filename = `Recording-${timestamp}.${audioFormat.ext}`;
      
      // Create local URL for immediate playback
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Add to session recordings for immediate access
      const newRecording = {
        url: audioUrl,
        filename: filename,
        duration: duration,
        format: audioFormat.ext,
        size: audioBlob.size,
        timestamp: new Date()
      };
      
      setSessionRecordings(prev => [...prev, newRecording]);
      
      // Upload file
      const audioFile = new File([audioBlob], filename, { 
        type: audioFormat.type,
        lastModified: Date.now()
      });
      
      console.log(`Uploading: ${filename} (${audioBlob.size} bytes, ${audioFormat.type})`);
      
      const { file_uri } = await UploadPrivateFile({ file: audioFile });
      
      // Create transcription record
      const transcriptionTitle = `Recording - ${format(new Date(), 'MMM dd, yyyy HH:mm')}`;
      
      await Transcription.create({
        title: transcriptionTitle,
        audio_file_uri: file_uri,
        status: 'processing', // Indicates it needs transcription
        duration_seconds: duration,
        summary: "Audio recorded successfully. Ready for transcription and analysis.",
        key_takeaways: [`High-quality ${audioFormat.ext.toUpperCase()} recording captured (${duration}s)`],
        action_items: ["Get transcript using external service", "Upload transcript for AI analysis"]
      });

      toast({ 
        title: "🎉 Recording Saved!", 
        description: `${filename} uploaded successfully. Duration: ${formatTime(duration)}`
      });
      
      // Clear chunks
      audioChunks.current = [];
      setStatus('idle');
      
      // Refresh transcriptions list
      fetchTranscriptions();
      
    } catch (error) {
      console.error("Failed to save recording:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Could not save the recording", 
        variant: "destructive" 
      });
      setStatus('idle');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({ 
        title: "File Too Large", 
        description: "Please upload audio files under 50MB.", 
        variant: "destructive" 
      });
      return;
    }

    const supportedTypes = ['audio/mp3', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/webm'];
    if (!supportedTypes.includes(file.type)) {
      toast({ 
        title: "Unsupported Format", 
        description: "Please upload MP3, MP4, WAV, M4A, or WebM files.", 
        variant: "destructive" 
      });
      return;
    }

    setStatus('uploading');

    try {
      console.log(`Uploading file: ${file.name} (${file.size} bytes, ${file.type})`);
      
      const { file_uri } = await UploadPrivateFile({ file });
      
      const transcriptionTitle = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      
      await Transcription.create({
        title: transcriptionTitle,
        audio_file_uri: file_uri,
        status: 'processing',
        duration_seconds: 0, // Will be determined later
        summary: "Audio file uploaded successfully. Ready for transcription and analysis.",
        key_takeaways: [`Uploaded file: ${file.name}`],
        action_items: ["Get transcript using external service", "Upload transcript for AI analysis"]
      });

      toast({ 
        title: "📁 File Uploaded!", 
        description: `${file.name} is ready for transcription.`
      });
      
      setStatus('idle');
      fetchTranscriptions();
      
    } catch (error) {
      console.error("File upload failed:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Could not upload the file", 
        variant: "destructive" 
      });
      setStatus('idle');
    }

    // Clear file input
    event.target.value = '';
  };

  const handlePlayRecording = (recording, index) => {
    if (currentlyPlaying === index) {
      setCurrentlyPlaying(null);
      return;
    }

    // Create and play audio element
    const audio = new Audio(recording.url);
    audio.play();
    setCurrentlyPlaying(index);
    
    audio.onended = () => setCurrentlyPlaying(null);
    audio.onerror = () => {
      setCurrentlyPlaying(null);
      toast({ title: "Playback Error", description: "Could not play recording", variant: "destructive" });
    };
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {isConsentNeeded && <ConsentDialog onConfirm={startRecording} onCancel={() => setIsConsentNeeded(false)} />}
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Transcription Hub</h1>
          <p className="text-slate-600">
            Record meetings, upload audio files, and transform them into analyzed transcripts with AI.
          </p>
        </div>

        {/* Status Alert */}
        {status !== 'idle' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {status === 'recording' && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>}
                {status === 'uploading' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                <div>
                  <p className="font-medium text-blue-900">
                    {status === 'recording' && `Recording in progress... ${formatTime(recordingTime)}`}
                    {status === 'uploading' && 'Uploading and processing your audio...'}
                  </p>
                  {status === 'recording' && (
                    <p className="text-sm text-blue-700">
                      High-quality audio capture with noise suppression active
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Session Recordings */}
        <RecordingClips 
          recordings={sessionRecordings} 
          onPlay={handlePlayRecording}
          currentlyPlaying={currentlyPlaying}
        />

        {/* My Transcriptions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Transcriptions</span>
              {!isLoadingTranscriptions && transcriptions.length > 0 && (
                <Badge variant="outline" className="px-3 py-1">
                  {transcriptions.length} sessions
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Access your saved transcriptions, analyze with AI, and export professional reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTranscriptions ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading transcriptions...</span>
              </div>
            ) : transcriptions.length > 0 ? (
              <div className="space-y-4">
                {transcriptions.map(transcription => (
                  <TranscriptionCard key={transcription.id} transcription={transcription} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileAudio className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No transcriptions yet</h3>
                <p className="text-slate-500 mb-4">Start by recording audio or uploading a file to get started.</p>
                <Button onClick={() => setIsConsentNeeded(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Mic className="w-4 h-4 mr-2" />
                  Create First Recording
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}