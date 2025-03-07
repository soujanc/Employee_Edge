import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { BsFillPrinterFill } from "react-icons/bs";
import nicozn_logo from "../../assets/img/nicozn_logo.jpg"; // Import the logo image
import { useProfile } from "../../hooks/useProfile";
import { FaFileInvoiceDollar } from 'react-icons/fa';

function PaySlip() {
  const downloadPDF = () => {
    const content = document.getElementById("content");

    html2canvas(content, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' is for portrait mode, 'a4' is the page size
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("pay_slip.pdf");
    });
  };

  const { profileData } = useProfile();

  // Given today's date is 10/07/2024
  const currentDate = new Date(); // Months are 0-indexed, so 6 is July
  const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() ));
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const nextMonthName = monthNames[nextMonth.getMonth()];
  const nextMonthYear = nextMonth.getFullYear();


  return (
    <section className="bg-[#f7fbff] font-poppins mt-[60px] w-full h-fit items-center px-4 md:px-4 p-6 lg:px-8">
      <div>
      <div className="font-poppins mt-2 mb-2 text-gray-900 leading-3 text-2xl font-bold flex items-center py-4 text-left w-full lg:pr-0">
        <div className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] flex justify-center items-center">
          <FaFileInvoiceDollar size={17} />
        </div>
        <span className="ml-2">PaySlip</span>
      </div>
      <div className="font-poppins mx-auto p-5 border rounded-lg shadow-lg bg-white" id="content">

          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <img
                src={nicozn_logo}
                alt="Nicozn Technologies"
                className="w-32 h-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold">Nicozn Technologies</h1>
                <p className="text-sm text-gray-700">
                  4th floor, Nitte Day Care Center, Pumpwell Mangaluru, 575007
                  India
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700 flex justify-end">Pay Slip for the Month</p>
              <p className="text-sm font-semibold">{`${nextMonthName} ${nextMonthYear}`}</p>
            </div>
          </div>
          <hr className="my-4 border-gray-700" />
          <div className="flex justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-600 mb-2">EMPLOYEE SUMMARY</h2>
              <div className="text-sm text-gray-700">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="mb-2">
                      <td className="pr-2">Employee Name</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{profileData.personalInfo.firstName} {profileData.personalInfo.lastName}</td>
                    </tr>
                    <tr className="mb-2">
                      <td className="pr-2">Pay Period</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{`${nextMonthName} ${nextMonthYear}`}</td>
                    </tr>
                    <tr className="mb-2">
                      <td className="pr-2">Pay Date</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">03/{`${nextMonth.getMonth() + 1}/${nextMonth.getFullYear()}`}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border border-gray-200 p-5 rounded-lg w-64">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <p className="text-2xl font-semibold">₹{profileData.professionalInfo.salary}</p>
                <p className="text-sm text-gray-600">Employee Net Pay</p>
              </div>
              <div className="text-sm text-gray-700">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="flex justify-between mb-1">
                      <td className="pr-2">Account No</td>
                      <td className="pr-2">:</td>
                      <td>{profileData.professionalInfo.Accountnumber}</td>
                    </tr>
                    <tr className="flex justify-between">
                      <td className="pr-2">IFSC code</td>
                      <td className="pr-2">:</td>
                      <td>{profileData.professionalInfo.IFSC}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr className="my-4 border-dotted border-gray-700" />
          <div className="mb-2">
            <div className="flex justify-between">
              <div className="text-sm text-gray-700">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="mb-2">
                      <td className="pr-2">Country</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{profileData.professionalInfo.jobTitle}</td>
                    </tr>
                    <tr className="mb-2">
                      <td className="pr-2">City</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{profileData.personalInfo.address.city}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-right text-sm text-gray-700">
                <table className="w-full text-left">
                  <tbody>
                    <tr className="mb-2">
                      <td className="pr-2">Date of Joining</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{profileData.professionalInfo.joiningdate}</td>
                    </tr>
                    <tr className="mb-2">
                      <td className="pr-2">Bank Name</td>
                      <td className="pr-2">:</td>
                      <td className="text-black">{profileData.professionalInfo.Bankname}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr className="my-4 border-dotted border-gray-700" />
          <div className="mb-5 text-sm mt-7">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-left text-gray-700 bg-gray-50 border-b border-gray-200">
                  <th className="border p-2">EARNINGS</th>
                  <th className="border p-2">AMOUNT</th>
                  <th className="border p-2">DEDUCTIONS</th>
                  <th className="border p-2">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Basic</td>
                  <td className="border p-2">₹{profileData.professionalInfo.salary}</td>
                  <td className="border p-2">Income Tax</td>
                  <td className="border p-2">₹0.00</td>
                </tr>
                <tr>
                  <td className="border p-2">House Rent Allowance</td>
                  <td className="border p-2">₹0.00</td>
                  <td className="border p-2">Provident Fund</td>
                  <td className="border p-2">₹0.00</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Gross Earnings</td>
                  <td className="border p-2 font-bold">₹{profileData.professionalInfo.salary}</td>
                  <td className="border p-2 font-bold">Total Deductions</td>
                  <td className="border p-2 font-bold">₹0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-7 p-4 border border-gray-400 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">TOTAL NET PAYABLE</p>
              <p className="text-sm text-gray-500">
                Gross Earnings - Total Deductions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">₹{profileData.professionalInfo.salary}</p>
            </div>
          </div>
          
          <hr className="my-5 border-gray-700" />
          <p className="mt-5 text-center text-gray-500 text-sm">
            -- This document has been automatically generated by Employee Edge
            Payroll; therefore, a signature is not required. --
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={downloadPDF}
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
          >
            <BsFillPrinterFill className="mr-2" />
            Print/Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}

export default PaySlip;
