"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layout";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ReceiptDownload from "../../../components/ReceiptDownload";
import { ConvexError } from "convex/values";
import Receipt, { StudentReceipt } from "@/components/ReceiptInfo";
import { Id } from "../../../../convex/_generated/dataModel";

interface ConvexReceipt {
  _id: string;
  receiptNumber: string;
  serviceType: string;
  studentName: string;
  programName: string;
  amount: number;
  receiptDate: number;
  paymentMethod?: string;
  studentEmail?: string;
  studentPhone?: string;
  notes?: string;
}

interface DisplayReceipt {
  id: string;
  type: string;
  customerName: string;
  service: string;
  amount: string;
  date: string;
  time: string;
  paymentMethod: string;
  status: string;
}

export default function ReceiptsPage() {
  const searchParams = useSearchParams();
  const receiptType = searchParams?.get('type') || 'student';
  const queryStudentId = searchParams?.get('studentId') || '';
  
  const [activeTab, setActiveTab] = useState("generate");
  const [currentReceiptType, setCurrentReceiptType] = useState(receiptType);
  const [receiptId, setReceiptId] = useState<Id<"studentReceipts"> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState<StudentReceipt>();
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    service: "",
    amount: "",
    paymentMethod: "cash",
    description: "",
    studentId: queryStudentId,
    program: ""
  });

  // Id<"studentReceipts">

  // Convex hooks
  const createReceipt = useMutation(api.receipts.createReceipt);
  const generateReceiptNumber = useQuery(api.receipts.generateReceiptNumber);
  const data = useQuery(api.receipts.getReceiptByIdWithStudentInfo, receiptId ? { receiptId } : "skip");
  
  const allReceipts = useQuery(api.receipts.getAllReceipts);
  
  const studentData = useQuery(
    api.student.getStudentByStudentId,
    formData.studentId && currentReceiptType === 'student' 
      ? { studentId: formData.studentId }
      : "skip"
  );

  useEffect(() => {
    setCurrentReceiptType(receiptType);
    // Update studentId from query params if available
    if (queryStudentId && queryStudentId !== formData.studentId) {
      setFormData(prev => ({
        ...prev,
        studentId: queryStudentId
      }));
    }
  }, [receiptType, queryStudentId]);

  // Auto-populate form when student data is fetched
  useEffect(() => {
    if (studentData && currentReceiptType === 'student') {
      // Find matching service based on program
      const matchingService = studentServices.find(service => 
        service.label.toLowerCase().includes(studentData.program.toLowerCase()) ||
        studentData.program.toLowerCase().includes(service.value.replace('-', ' '))
      );

      setFormData(prev => ({
        ...prev,
        customerName: studentData.name || prev.customerName,
        email: studentData.email || prev.email,
        phone: studentData.phone || prev.phone,
        program: studentData.program || prev.program,
        service: matchingService?.value || prev.service,
        amount: matchingService?.amount.toString() || prev.amount
      }));
    }
  }, [studentData, currentReceiptType]);

  // Convert Convex receipts to display format
  const receipts: DisplayReceipt[] = allReceipts?.map((receipt: ConvexReceipt) => ({
    id: receipt.receiptNumber,
    type: receipt.serviceType === 'training' ? 'Student' : 'Customer',
    customerName: receipt.studentName,
    service: receipt.programName,
    amount: `₦${receipt.amount.toLocaleString()}`,
    date: new Date(receipt.receiptDate).toLocaleDateString(),
    time: new Date(receipt.receiptDate).toLocaleTimeString(),
    paymentMethod: receipt.paymentMethod || 'Cash',
    status: "Paid"
  })) || [];

  // Convert to ReceiptDownload format
  const convertToReceiptData = (receipt: ConvexReceipt) => ({
    _id: receipt._id,
    studentName: receipt.studentName,
    studentEmail: receipt.studentEmail,
    studentPhone: receipt.studentPhone,
    receiptNumber: receipt.receiptNumber,
    amount: receipt.amount,
    currency: "NGN",
    paymentMethod: receipt.paymentMethod || "cash",
    serviceType: receipt.serviceType,
    programName: receipt.programName,
    notes: receipt.notes,
    _creationTime: receipt.receiptDate
  });

  const studentServices = [
    { value: "programming-class", label: "Programming Class - ₦100,000", amount: 100000 },
    { value: "desktop-publishing-3m", label: "Desktop Publishing (3 months) - ₦30,000", amount: 30000 },
    { value: "desktop-publishing-6m", label: "Desktop Publishing (6 months) - ₦60,000", amount: 60000 }
  ];

  const customerServices = [
    { value: "document-typing", label: "Document Typing - Custom Price", amount: 0 },
    { value: "scanning", label: "Scanning Services - Custom Price", amount: 0 },
    { value: "photocopying", label: "Photocopying - Custom Price", amount: 0 },
    { value: "laminating", label: "Laminating Services - Custom Price", amount: 0 },
    { value: "jamb-registration", label: "JAMB Registration - ₦7,000", amount: 7000 },
    { value: "waec-registration", label: "WAEC Registration - Custom Price", amount: 0 },
    { value: "computer-maintenance", label: "Computer Maintenance - Custom Price", amount: 0 },
    { value: "data-entry", label: "Data Entry Services - Custom Price", amount: 0 },
    { value: "project-creation", label: "Project Creation - Custom Price", amount: 0 }
  ];

  const services = currentReceiptType === 'student' ? studentServices : customerServices;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-fill amount for predefined services
    if (name === 'service') {
      const selectedService = services.find(s => s.value === value);
      if (selectedService && selectedService.amount > 0) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          amount: selectedService.amount.toString()
        }));
      }
    }
  };

  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    
    try {
      if (!generateReceiptNumber) {
        throw new Error("Unable to generate receipt number");
      }

      const selectedService = services.find(s => s.value === formData.service);
      const serviceType = currentReceiptType === 'student' ? 'training' : 'service';
      
      const receiptInfo = await createReceipt({
        studentID: formData.studentId || `CUST-${Date.now()}`, // Use provided studentId or generate one for customers
        studentName: formData.customerName,
        studentEmail: formData.email || undefined,
        studentPhone: formData.phone || undefined,
        receiptNumber: generateReceiptNumber,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        serviceType,
        programName: selectedService?.label || formData.service,
        notes: formData.description || undefined,
      });

      alert("Receipt generated and saved successfully!");
      console.log("top level", data);
      console.log("top level receipt", receiptInfo);
      
      // generateReceipt(receiptInfo.receiptId);
      generateReceipt(receiptInfo);
      // Reset form
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        service: "",
        amount: "",
        paymentMethod: "cash",
        description: "",
        studentId: queryStudentId, // Keep query param value when clearing
        program: ""
      });
      setReceiptId(undefined);
    } catch (error) {
      const message = error instanceof ConvexError ? error.data as { message: string } : "Unexpected error occured";
      // console.error("Error generating receipt:", error?.data);
      console.log(message);
      alert(message);
      
    } finally {
      setIsLoading(false);
    }
  };

  function generateReceipt(data: any) {
      console.log(`receipt to update ${data}`);
      const studentInfo = {
        studentId: data?.student?._id,
        studentName: data?.student?.name,
        studentEmail: data?.student?.email,
        studentPhone: data?.student?.guardianPhoneNumber,
        
        // Receipt details
        receiptNumber: data?.receipt?.receiptNumber,
        receiptDate: data?.receipt?.receiptDate,
        dueDate: data?.receipt?.dueDate,
        
        // Payment information
        amount: data?.receipt?.amount,
        amountPaid: data?.receipt?.amountPaid,

        paymentMethod: data?.receipt?.paymentMethod,
        
        // Service/Program details
        serviceType: data?.receipt?.serviceType, 
        programName: data?.receipt?.programName,
        
        // Academic/Session information
        session: data?.receipt?.session, // e.g., "2024/2025"
        
        // Administrative
        issuedBy: data?.receipt?.issuedBy,
        notes: data?.receipt?.notes,
        isActive: true, 
        
        // Timestamps
        createdAt: data?.receipt?.createdAt
      };

      setReceiptInfo(studentInfo as StudentReceipt);
  }


  return (
    <>
    <div className="w-full">
        <Receipt />
    </div>
        {/* {receiptInfo && <div>
          <Receipt receiptInfo={receiptInfo}/>
          </div>} */}
  
    
    
    </>
    
  );
} 