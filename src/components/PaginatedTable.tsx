import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { ExamCardsData, ScratchCard } from '@/api/exam-cards/type';
import { getExamType } from '@/lib/determine-exam-type';
import convertToLongDate from '@/lib/date';
import Status from './custom-ui/status';


export const WAECPaginatedTable = ({ 
  data = [], 
  itemsPerPage = 10,
  onDownload
}: {data: ExamCardsData[], itemsPerPage?: number, onDownload: (card: ScratchCard, reference: string) => void}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };



  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="border border-black bg-gray-200">
          <tr>
            <th className="border border-black p-2">S/N</th>
            <th className="border border-black p-2">Date</th>
            <th className="border border-black p-2">Transaction ID</th>
            <th className="border border-black p-2">Exam Type</th>
            <th className="border border-black p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((card, index) => (
              <tr className="text-center" key={card.pin}>
                <td className="border border-black p-2">
                  {index+1}
                </td>
                <td className="border border-black p-2">
                  {convertToLongDate(card.created_at)}
                </td>
                <td className="border border-black p-2">{card.reference}</td>
                <td className="border border-black p-2">
                  {getExamType(card.exam_card_id)}
                </td>
                <td className="border border-black p-2">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        onDownload(
                          { serialNumber: card.serial_number, pin: card.pin },
                          card.reference
                        )
                      }
                      className="hover:opacity-70"
                    >
                      <Download size={18} />
                    </button>
                    <Status status="active" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}  className="border border-black p-4 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === page
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

