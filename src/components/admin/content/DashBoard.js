import { useEffect, useState } from "react";
import "./DashBoard.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashBoard } from "../../../services/APIService";

const DashBoard = () => {
  const [dataOverview, setDataOverview] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    fetchDataOverview();
  }, []);

  // fetch data on page load
  const fetchDataOverview = async () => {
    let data = await getDashBoard();
    if (data?.DT) {
      setDataOverview(data.DT);
      const initDataChart = [
        {
          name: "Quizzes",
          Quizzes: data.DT.others.countQuiz,
        },
        {
          name: "Questions",
          Questions: data.DT.others.countQuestions,
        },
        {
          name: "Answers",
          Answers: data.DT.others.countAnswers,
        },
      ];
      setDataChart(initDataChart);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="title">Analytics Dashboard</div>
      <div className="dashboard-content">
        <div className="left-content">
          <div className="static">
            <span className="text1">Total Accounts</span>
            <span className="text2">
              {dataOverview?.users?.total ? (
                <>{dataOverview.users.total}</>
              ) : (
                <>0</>
              )}
            </span>
          </div>
          <div className="static">
            <span className="text1">Total Admins</span>
            <span className="text2">
              {dataOverview?.users?.countAdmin ? (
                <>{dataOverview.users.countAdmin}</>
              ) : (
                <>0</>
              )}
            </span>
          </div>
          <div className="static">
            <span className="text1">Total Users</span>
            <span className="text2">
              {dataOverview?.users?.countUsers ? (
                <>{dataOverview.users.countUsers}</>
              ) : (
                <>0</>
              )}
            </span>
          </div>
          <div className="static">
            <span className="text1">Total Quizzes</span>
            <span className="text2">
              {dataOverview?.others?.countQuiz ? (
                <>{dataOverview.others.countQuiz}</>
              ) : (
                <>0</>
              )}
            </span>
          </div>
        </div>
        <div className="right-content">
          <ResponsiveContainer
            width="95%"
            height="100%"
            className="barchart-container"
          >
            <BarChart
              width={500}
              height={300}
              data={dataChart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={100}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Quizzes" fill="#8884d8" stackId="a" />
              <Bar dataKey="Questions" fill="#82ca9d" stackId="a" />
              <Bar dataKey="Answers" fill="orange" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
