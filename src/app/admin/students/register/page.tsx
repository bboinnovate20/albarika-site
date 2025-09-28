"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import PaymentPopup from "../../../../components/PaymentPopup";

export default function StudentRegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [registeredStudentData, setRegisteredStudentData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    
    // Program Information
    program: "",
    programDuration: "",
    enrollmentDate: "",
    endDate: "",
    status: "Active",
    month: 0,
    
    // Guardian/Emergency Contact Information
    guardianName: "",
    guardianPhoneNumber: "",
    guardianRelationship: "",

    
    // Academic Information
    previousEducation: "",
    
    // Administrative
    notes: "",
  });

  // Convex hooks
  const createStudent = useMutation(api.student.createStudent);
  const generateStudentNumber = useQuery(api.student.generateStudentNumber);
  const generateUploadUrl = useMutation(api.student.generateUploadUrl);

  const programs = [
    { value: "Desktop Publishing (3 months)", label: "Desktop Publishing (3 months)", duration: "3 months", month: 3 },
    { value: "Desktop Publishing (6 months)", label: "Desktop Publishing (6 months)", duration: "6 months", month: 6 },
    { value: "Programming Class", label: "Programming Class", duration: "6 months", month: 6 },
    { value: "Computer Maintenance", label: "Computer Maintenance", duration: "3 months", month: 3 },
    { value: "Data Entry", label: "Data Entry", duration: "2 months", month: 2 },
  ];

  const statuses = [
    "Active",
    // "Completed", 
    // "Suspended",
    // "Dropped"
  ];

  const genders = [
    "Male",
    "Female",
    "Other"
  ];

  const relationships = [
    "Parent",
    "Guardian",
    "Spouse",
    "Sibling",
    "Relative",
    "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedFormData = {
      ...formData,
      [name]: value
    };

    // Auto-set program duration and month when program is selected
    if (name === 'program') {
      const selectedProgram = programs.find(p => p.value === value);
      if (selectedProgram) {
        updatedFormData = {
          ...updatedFormData,
          programDuration: selectedProgram.duration,
          month: selectedProgram.month,
        };
        
        // Calculate end date if enrollment date exists
        if (formData.enrollmentDate) {
          const enrollmentDate = new Date(formData.enrollmentDate);
          const endDate = new Date(enrollmentDate);
          endDate.setMonth(endDate.getMonth() + selectedProgram.month);
          updatedFormData.endDate = endDate.toISOString().split('T')[0];
        }
      }
    }

    // Auto-calculate end date when enrollment date changes
    if (name === 'enrollmentDate' && value && formData.month > 0) {
      const enrollmentDate = new Date(value);
      const endDate = new Date(enrollmentDate);
      endDate.setMonth(endDate.getMonth() + formData.month);
      updatedFormData.endDate = endDate.toISOString().split('T')[0];
    }

    setFormData(updatedFormData);
  };

  function generateSessions(startYear: number, startMonth: number): string {
    const baseStartYear = startMonth >= 10 ? startYear + 1 : startYear;
    return `${baseStartYear}/${baseStartYear + 1}`;
  }

  // Image compression function
  const compressImage = (file: File, maxSizeMB: number = 0.5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              // Check if file is still too large
              if (compressedFile.size > maxSizeMB * 1024 * 1024) {
                // Reduce quality further
                canvas.toBlob(
                  (secondBlob) => {
                    if (secondBlob) {
                      const finalFile = new File([secondBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                      });
                      resolve(finalFile);
                    } else {
                      reject(new Error('Failed to compress image'));
                    }
                  },
                  'image/jpeg',
                  0.3
                );
              } else {
                resolve(compressedFile);
              }
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.6
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsCompressing(true);
    
    try {
      let processedFile = file;
      
      // Compress if file is larger than 500KB
      if (file.size > 512 * 1024) {
        processedFile = await compressImage(file, 0.5);
        console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedFile.size / 1024).toFixed(0)}KB`);
      }
      
      setSelectedImage(processedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(processedFile);
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageStorageId = null;
      
      // Upload image if selected
      if (selectedImage) {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        
        const { storageId } = await result.json();
        imageStorageId = storageId;
      }

      const studentData = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        program: formData.program,
        programDuration: formData.programDuration || undefined,
        enrollmentDate: formData.enrollmentDate ? new Date(formData.enrollmentDate).getTime() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : undefined,
        status: formData.status,
        guardianName: formData.guardianName || undefined,
        guardianPhoneNumber: formData.guardianPhoneNumber || undefined,
        guardianRelationship: formData.guardianRelationship || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).getTime() : undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        previousEducation: formData.previousEducation || undefined,
        notes: formData.notes || undefined,
        ...(imageStorageId && { imageId: imageStorageId }),
      };

      const createdStudent = await createStudent(studentData);

      // Store student data with the generated studentId for payment popup
      const registeredStudentWithId = {
        ...formData,
        studentId: createdStudent.generatedStudentId,
        _id: createdStudent._id,
      };
      console.log(registeredStudentWithId);
      setRegisteredStudentData(registeredStudentWithId);
      setShowPaymentPopup(true);
      
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Error registering student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentPopup(false);
    alert("Student registered and payment processed successfully!");
    resetForm();
  };

  const handlePaymentSkip = () => {
    setShowPaymentPopup(false);
    alert("Student registered successfully! Payment can be processed later.");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      month: 0,
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      program: "",
      programDuration: "",
      enrollmentDate: "",
      endDate: "",
      status: "Active",
      guardianName: "",
      guardianPhoneNumber: "",
      guardianRelationship: "",
      previousEducation: "",
      notes: "",
    });
    setRegisteredStudentData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
        <p className="text-gray-600 mt-2">Register new students for training programs</p>
        {generateStudentNumber && (
          <p className="text-sm text-blue-600 mt-2">
            Next Student ID: {generateStudentNumber}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
          <p className="text-gray-600 mt-1">Fill in all required information to register a new student</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="fas fa-user mr-2 text-blue-600"></i>
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter student's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  {genders.map((gender) => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="student@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08012345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Complete address"
                />
              </div>

              
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Photo
                  <span className="text-xs text-gray-500 ml-2">(Optional - Max 500KB, auto-compressed)</span>
                </label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isCompressing}
                    />
                    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors ${
                      isCompressing ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}>
                      <div className="space-y-2">
                        <i className={`fas ${isCompressing ? 'fa-spinner fa-spin' : 'fa-camera'} text-gray-400 text-2xl`}></i>
                        <p className="text-gray-600">
                          {isCompressing ? 'Processing image...' : 'Click to upload student photo'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, JPEG up to 10MB (will be compressed to 500KB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Student preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        <i className="fas fa-check-circle text-green-600 mr-1"></i>
                        Image uploaded successfully
                      </p>
                      {selectedImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          Size: {(selectedImage.size / 1024).toFixed(0)}KB
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Program Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="fas fa-graduation-cap mr-2 text-green-600"></i>
              Program Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Program *
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.value} value={program.value}>
                      {program.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Duration
                </label>
                <input
                  type="text"
                  name="programDuration"
                  value={formData.programDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 6 months"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected End Date
                  <span className="text-xs text-gray-500 ml-2">(Auto-calculated)</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Education
                </label>
                <input
                  type="text"
                  name="previousEducation"
                  value={formData.previousEducation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., BSc Computer Science, SSCE, etc."
                />
              </div>
            </div>
          </div>

          {/* Guardian Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="fas fa-users mr-2 text-purple-600"></i>
              Guardian/Emergency Contact Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Guardian's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  name="guardianPhoneNumber"
                  value={formData.guardianPhoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08012345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  name="guardianRelationship"
                  value={formData.guardianRelationship}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  {relationships.map((relationship) => (
                    <option key={relationship} value={relationship}>{relationship}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <i className="fas fa-sticky-note mr-2 text-orange-600"></i>
              Additional Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information about the student..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'} mr-2`}></i>
              {isLoading ? 'Registering...' : 'Register Student'}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
          </div>
        </form>
      </div>

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={handlePaymentSkip}
        studentData={registeredStudentData}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
} 