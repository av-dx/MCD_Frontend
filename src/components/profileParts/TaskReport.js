import { useState, useEffect, useRef, useContext } from 'react';
import { BsListTask, BsDownload } from 'react-icons/bs';
import { CSVLink } from 'react-csv';

import { AuthContext } from '../../store/AuthProvider';

import '../css/components.css';
import { Table } from 'react-bootstrap';

const TaskReport = () => {
  const { userState, _ } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;

  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [selectedTaskName, setSelectedTaskName] = useState('data'); // setting the task name for getting correct filename
  const csvLink = useRef();

  useEffect(() => {
    const fetcher = async () => { // Getting all tasks
      const res = await fetch(
        `${process.env.REACT_APP_API}/task/creator?auth_token=${userAuthToken}/`
      );
      const { response } = await res.json();
      console.log(response);
      setTasks(response || []);
    };
    fetcher();
  }, []);

  const headers = [  // Headers for CSV
    { label: 'Task ID', key: '_id' },
    { label: 'Task Name', key: 'name' },
    { label: 'Question ID', key: 'question_list.id' },
    { label: 'Question Prompt', key: 'question_list.question_prompt' },
    { label: 'Question type', key: 'question_list.question_type' },
    { label: 'Question Level', key: 'question_list.question_level' },
    { label: 'Question Language', key: 'question_list.language' },
    { label: 'Response ID', key: 'responses._id' },
    { label: 'User ID', key: 'responses.user_id' },
    { label: 'User First Name', key: 'responses.user.first_name' },
    { label: 'User First Name', key: 'responses.user.last_name' },
    { label: 'User Email Address', key: 'responses.user.email' },
    { label: 'Response Text', key: 'responses.response' },
    { label: 'Seqno', key: 'question_list.seqno' },
  ];

  const onDownload = async (e, taskid) => {  
    // Getting data for the task
    const res = await fetch(
      `${process.env.REACT_APP_API}/task/${taskid}/report?auth_token=${userAuthToken}/`
    );
    const { response } = await res.json();
    setSelectedTaskName( tasks.filter(t => t._id === taskid)[0].name)
    setData(response);
    csvLink.current.link.click(); // Making the download happen
  };

  return (
    <div className="report-container">
      <Table className="report-table" size="md" bordered hover>
        <thead>
          <tr>
            <th>S No.</th>
            <th>Task Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{task.name}</td>
              <td>
                <div className="download-button" onClick={(e) => onDownload(e, task._id)}>
                  <BsDownload />
                  <div style={{ fontSize: '1rem' }}> Download</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <CSVLink
        ref={csvLink}
        filename={`${selectedTaskName}.csv`}
        className="hidden"
        target="_blank"
        data={data}
        headers={headers}
      />
    </div>
  );
};

export default TaskReport;
