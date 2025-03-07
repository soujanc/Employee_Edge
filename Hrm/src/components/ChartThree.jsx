import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';
import { useEmployee } from '../hooks/useEmployee';



const options = {
  chart: {
    fontFamily: 'poppins, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  labels: ['', 'male', 'others', 'female'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = () => {
  const { maleCount, femaleCount,otherCount } = useEmployee();


const totalCount = maleCount + femaleCount;
const malePercentage = totalCount ? ((maleCount / totalCount) * 100).toFixed(1) : 0;
const femalePercentage = totalCount ? ((femaleCount / totalCount) * 100).toFixed(1) : 0;
const OtherPercentage = totalCount ? ((otherCount / totalCount) * 100).toFixed(1) : 0;

  const [state, setState] = useState({
    series: [0,maleCount, otherCount, femaleCount],
  });

  useEffect(() => {
    setState({
      series: [0, maleCount, otherCount, femaleCount],
    });
  }, [maleCount, femaleCount, otherCount]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [0, 20, 0, 20],
    }));
  };
  handleReset;

  return (
    <div className="sm:px-[30px] col-span-12 font-poppins  bg-white px-5 pb-5 pt-7.5 t dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-medium text-black dark:text-white">
            Employee Analytics
          </h5>
        </div>
      </div>

      <div className="mb-[60px]">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Male </span>
              <span>{malePercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
          <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Female</span>
              <span>{femalePercentage}% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
          <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Others</span>
              <span>{OtherPercentage}% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
