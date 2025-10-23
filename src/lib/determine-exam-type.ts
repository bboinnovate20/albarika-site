export function getExamType(examId: number): string {
  switch (examId) {
    case 1:
      return "WAEC";
    case 2:
      return "NECO";
    default:
      return "Unknown Exam Type";
  }
}
