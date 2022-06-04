import React, { useState, useReducer, useContext, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import TransInput from "./TransInput";

import { AuthContext } from "../store/AuthProvider";

// ALL Question Input related
const QueAns = ({ question, taskId, index, questionsMap, setQuestionsMap }) => {
  const { userState, _ } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;
  console.log('question Q:', question);
  // MAIN submit which sends values to the backend
  const submitAns = (data) => {
    console.log("UserNewResponse:", data.userAns);
    //update locally
    let newMap = { ...questionsMap };
    newMap[index]["annotation_done"] = true;
    newMap[index]["user_response"] = data.userAns;
    setQuestionsMap(newMap);
    //update in the backend

    const postObj = {
      method: "POST",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response: data.userAns,
        response_type: question.question_type,
      }),
    };
    const getFeedback = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/task/${taskId}/annotation/${question.id}?auth_token=${userAuthToken}/`,
        postObj
      );
      const data = await response.json();
      console.log(data);
    };
    getFeedback();
  };

  // Types of Questions
  // TEXT
  const TextInput = ({ userResponse, lang }) => {
    const [text, setText] = useState("");
    useEffect(()=>{
      if (text === "" && userResponse && userResponse.length > 0) {
        setText(userResponse[0]);
        console.log("userResponse", userResponse,'\ntext:' , text);
      }
    }, []);

    return (
      <Form>
        {lang === "en" && (
          <Form.Control
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your answer"
          />
        )}
        {lang !== "en" && (
          <TransInput
            lang={lang}
            index={index}
            text={text}
            setText={setText}
          />
        )}
        {text.length > 0 && (
          <div className="submitBtn">
            <Button onClick={() => submitAns({ userAns: [text] })}>
              Submit !
            </Button>
          </div>
        )}
      </Form>
    );
  };

  //MCQ Single
  const MCQsingle = ({ options, userResponse }) => {
    const [selected, setSelected] = useState("");

    if (selected === "" && options.includes(userResponse[0])) {
      setSelected(userResponse[0]);
    }

    console.log("mcq-single selected:", selected);
    return (
      <Form>
        {options.map((option) => (
          <Form.Check
            type="radio"
            key={option}
            label={option}
            className="bigMcq"
            checked={selected === option ? true : false}
            onChange={() => {
              console.log("option:", option);
              setSelected(option);
              console.log("post:", selected);
            }}
          />
        ))}
        {options.includes(selected) && (
          <div className="submitBtn">
            {/* <Button onClick={()=>submitSingle()}>Submit !</Button> */}
            <Button onClick={() => submitAns({ userAns: [selected] })}>
              Submit !
            </Button>
          </div>
        )}
      </Form>
    );
  };

  // MCQ multiple
  const mcqReducer = (oldState, curOption) => {
    let newState = { ...oldState };
    newState[curOption] = !oldState[curOption];
    return newState;
  };

  const MCQmultiple = ({ options, userResponse }) => {
    let defaultState = {};
    options.map((option) => {
      defaultState[option] = false;
      if (userResponse.includes(option)) {
        defaultState[option] = true;
      }
      return <></>;
    });
    const [mcqState, mcqDispatcher] = useReducer(mcqReducer, defaultState);

    const isTrue = (value) => {
      return value === true;
    };
    const mcqSubmit = () => {
      let data = { userAns: [] };
      Object.keys(mcqState).map((key) => {
        if (mcqState[key]) {
          data.userAns.push(key);
        }
      });
      submitAns(data);
    };
    return (
      <Form>
        {options.map((option) => (
          <Form.Check
            type="checkbox"
            key={option}
            label={option}
            className="bigMcq"
            checked={mcqState[option]}
            onChange={() => {
              mcqDispatcher(option);
            }}
          />
        ))}
        {Object.values(mcqState).some(isTrue) && (
          <div className="submitBtn">
            <Button onClick={() => mcqSubmit()}>Submit !</Button>
          </div>
        )}
      </Form>
    );
  };

  //Translation
  const Translation = ({ options=['Correct', 'Modify'], userResponse, questionDefaultValue, lang }) => {
    const [text, setText] =useState("");
    const [selected, setSelected] = useState("");
    const [textReadOnly, setTextReadOnly] =useState(true);

    useEffect(()=>{
      if (selected=== "" && userResponse.length>0) {
        if (userResponse[0]==='Correct'){
          setSelected('Correct');
          setText('Correct');
        }
        else{
          setSelected('Modify');
          setText(userResponse[0]);
        }
      }
    }, []);

    useEffect(()=>{
      console.log("selected changed:", selected);
      if (selected==='Modify'){
        setTextReadOnly(false);
        if(userResponse.length===0 || userResponse[0]==='Correct'){
          setText(questionDefaultValue);
          console.log('text=queDefault:', questionDefaultValue);
        }
        else{
          setText(userResponse[0]);
          console.log('text=userResponse[0]:', userResponse[0]);
        }
      }
      else {
        setText('Correct');
        setTextReadOnly(true);
      }

    }, [selected])
   

    return (
      <Form>
        {options.map((option) => (
          <Form.Check
            type="radio"
            key={option}
            label={option}
            className="bigMcq"
            checked={selected === option ? true : false}
            onChange={() => {
              console.log("option:", option);
              setSelected(option);
              console.log("post:", selected);
            }}
          />
        ))}

        
        {lang === "en" && (
          <Form.Control
            as="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            hidden={textReadOnly}
            style={{height:'8em'}}
          />
        )}
        {lang !== "en" && (
          <TransInput
            lang={lang}
            index={index}
            text={text}
            setText={setText}
            hidden={textReadOnly}
          />
        )}
          {/* <Form.Control type="text" as='textarea' 
            readOnly={textReadOnly} 
            value={textDefault}
            onChange={(e)=>setTextDefault(e.target.value)}
          /> */}
      

        {options.includes(selected) && (
          <div className="translationBtns" >
            <div className="leftBtns" hidden={selected==='Correct'}>
            <Button variant='outline-secondary' onClick={()=>setText(questionDefaultValue)}>
                Default Translation 
              </Button>
              <Button variant='outline-secondary' onClick={()=>setText('')}>
                Clear Text
              </Button>
            </div>

            <Button hidden={selected==='Modify' && (text.trim()==="" || text.trim()===questionDefaultValue.trim())}
              onClick={() => submitAns({ userAns: [text] })} style={{marginLeft:'auto'}}>
              Submit !
            </Button>
          </div>
        )}
      </Form>
    );
  };

  return (
    <Tab.Pane eventKey={index}>
      <div className="QnA">
        <>
          {/* <h5>
            <span className="spChar mr-1">Q:</span> {question.question_prompt}{" "}
          </h5> */}
          <h5 style={{display:'flex', flexFlow:'row'}}>
            <span className="spChar mr-1">Q:</span><p dangerouslySetInnerHTML={{ __html: question.question_prompt }}></p>{" "}
          </h5>
          <div style={{ display: "flex" }}>
            <h5>
              <span className="spChar mr-1">A:</span>
            </h5>
            <div className="AnsForm">
              {question.question_type === "text" ? (
                <TextInput
                  userResponse={question.user_response}
                  lang={question.text_input_language}
                />
              ) : question.question_type === "mcq-multiple-correct" ? (
                <MCQmultiple
                  options={question.response_options}
                  userResponse={question.user_response}
                />
              ) : question.question_type === "mcq-single-correct" ? (
                <MCQsingle
                  options={question.response_options}
                  userResponse={question.user_response}
                />
              ) : question.question_type === "translation" ? (
                  <Translation
                    userResponse={question.user_response}
                    lang={question.text_input_language}
                    questionDefaultValue = {question.default_value}
                  />
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      </div>
    </Tab.Pane>
  );
};

export default QueAns;
