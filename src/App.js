import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState, useEffect} from 'react';
import {Amplify,API} from 'aws-amplify';
import awsExports from "./aws-exports";


Amplify.configure(awsExports);

const apiName = 'accessDB';


function Course(props){
    
    const [list,setlist] = useState(props.courseInst);

    console.log(list);

    function addSection(e){
      const add = async () => {
          try {
          
          
            console.log("...sending AJAX add call");
            const result = await API.post(apiName, '/add', {
              body: {
                courseId: props.id,
                id: parseInt(e.target.value,10)
              }
            });
            if (result) {
              console.log("Course section addition completed.");
              setlist([...list,{
                                  course_id: props.id,
                                  instructor_id: parseInt(e.target.value,10)
                              }
              ]);
            }
            else{
              console.log("Course section addition failed.");
            }
          
          } catch(error) {
  
            console.log("unable to reach data, course section addition failed...")
  
          }
          
      };
  
      add();
    }

    const handleChange = (curSec,selSec) => {
      console.log(curSec);
      console.log(selSec);
    
      //setlist(list.map((section) => section.instructor_id === curSec ? {id: parseInt(selSec), instructor: parseInt(selSec)} : section));
      const update = async () => {
        try {
        
        
          console.log("...sending update call");
          const result = await API.post(apiName, '/update', {
            body: {
              curId: curSec,
              selId: parseInt(selSec),
              courseId: props.id
            }
          });
          if (result) {
            console.log("Course section update completed.");
            setlist(list.map((section) => section.instructor_id === curSec ? {course_id: props.id, instructor_id: parseInt(selSec)} : section));
          }
          else{
            console.log("Course section update failed.");
          }
        
        } catch(error) {

          console.log("unable to reach data, course sectino update failed...")

        }
        
    };

    update();

    }
    
    const handleDelete = (curSec) => {
        //setlist(list.filter((section) => section.instructor_id !== curSec));
        console.log(curSec);
        const del = async () => {
          try {
          
          
            console.log("...sending AJAX delete call");
            const result = await API.post(apiName, '/delete', {
                body: {
                  id: curSec,
                  courseId: props.id
                }
            });
            console.log(result);

            // const result = await axios.post('http://localhost:8080/delete', {
            //   id: curSec,
            //   courseId: props.id
            // });
            if (result) {
              console.log("Deletion completed.");
              setlist(list.filter(section => curSec !== section.instructor_id));
            }
            else{
              console.log("Delete failed.");
            }
          
          } catch(error) {
  
            console.log("unable to reach data, delete failed...")
  
          }
          
      };
  
      del();
    }
    
    return (<tr>
      <th key={props.id} scope="row" >{props.name}</th>
      <td>
          <div className="row g-2">

            {list.map((section) => <Section section = {section.instructor_id} instructors={props.instructors} handleChange = {handleChange} handleDelete = {handleDelete} />)}

            {/* {props.courseInst.map(section => {
              return (<div key={section.id} className="col-auto">
                {props.instructors.find((obj) => obj.id === section.instructor).name}
              </div>
              );
            })} */}

            <div className="col-auto">
              <select onChange = {addSection} className="form-select">
                <option disabled value="-1" selected>Add Section...</option>
                <option value="1">Ayati</option>
                <option value="2">Kim</option>
                <option value="3">Gao</option>
                <option value="4">Schweller</option>
                <option value="5">Dietrich</option>
                <option value="6">Tomai</option>
                <option value="7">Wylie</option>
              </select>
            </div>

            
          </div>
      </td>
    </tr>
  );
};

function Section(sec){
      
  console.log(sec.section);

  return (
                        <div class="col-auto">
                            <div class="input-group">
                                <select onChange={e => sec.handleChange(sec.section,e.target.value)} value= {sec.section} class="form-select">
                                    <option value="1">Ayati</option>
                                    <option value="2">Kim</option>
                                    <option value="3">Gao</option>
                                    <option value="4">Schweller</option>
                                    <option value="5">Dietrich</option>
                                    <option value="6">Tomai</option>
                                    <option value="7">Wylie</option>
                                </select>
                                <button onClick={e => sec.handleDelete(sec.section)}class="btn btn-danger">-</button>
                            </div>
                        </div>
);
};



function App() {
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [testData,setTestData] = useState([]);
  
  console.log("Rerendering App");

  useEffect(() => {

    const fetch = async () => {
        try {
        
        
          console.log("...requesting from Lambda function");
          setLoading(true);
          const result = await API.get(apiName, '/data');
          console.log("...response from Lambda returned");
          console.log(result.data);
          setData(result.data);
          setLoading(false);
          
        
        } catch(error) {

          setLoading(false);
          setError("Unable to retreive data from server, please try again later.");

        }
        
    };

    fetch();

  }, []);

  console.log("...rendering");

  // const instructors = [
  //   {id: 12, name: 'Ayati'},
  //   {id: 7, name: 'Gao'},
  //   {id: 2, name: 'Kim'},
  //   {id: 23, name: 'Schweller'},
  //   {id: 31, name: 'Tomai'},
  //   {id: 3, name: 'Wylie'}
  // ];

  // const courses = [
  //   { id: 1, 
  //     name: "1370", 
  //     sections: [{id: 15, instructor: 12}, {id: 16, instructor: 2}]
  //   },
  //   { id: 2, 
  //     name: "3329", 
  //     sections: [{id: 17, instructor: 7}, {id: 18, instructor: 31}, {id: 19, instructor: 31}]
  //   },
  //   { id: 3, 
  //     name: "3340", 
  //     sections: [{id: 20, instructor: 23}, {id: 21, instructor: 3}]
  //   }
  // ];

  const handleChange = e => {

    console.log(e.target.value);

    setData([...data.courses,{id: parseInt(e.target.value),
                            name: e.target.value,
                            sections: []}]);

    const courses = async () => {
          try {
          
          
            console.log("...sending AJAX course addition call");
            const result = await axios.post('http://localhost:8080/courses', {
              course: e.target.value
            });
            if (result.data.status === 'OK') {
              console.log("Course addition completed.");
              setData([...data.courses,{id: parseInt(e.target.value),
                                        name: e.target.value,
                                        sections: []
                                      }
              ]);
            }
            else{
              console.log("Course addition failed.");
            }
          
          } catch(error) {
  
            console.log("unable to reach data, course addition failed...")
  
          }
          
      };
  
      courses();
  }

  return (
    
    <div className="container">

    {loading ? <h2>...Loading</h2>
    : error ? 
        <div>
          <h2>Error</h2>
          <pre>{error}</pre>
        </div>
    :
    <div>

    <h1>Build-A-Schedule</h1>

    <table className="table">
        <thead>
            <tr>
                <th scope="col">Course</th>
                <th scope="col">Sections</th>
            </tr>
        </thead>
        <tbody>
          { data.courses.map((course) => <Course id={course.id} name={course.name} courseInst = {course.sections} instructors={data.instructors}/>)}
        </tbody>
    </table>

    <div class="row">
        <div class="col-auto">
            <div class="input-group mb-3">
                <form onSubmit = {handleChange} onBlur={handleChange} >
                  <input type="text" class="form-control" placeholder="Course Number" name="addCourse" />
                </form>
                <button type="submit" class="btn btn-primary" id="button-addon2">Add Course</button>
            </div>
        </div>
    </div>
    </div>}

    </div>
    
  );
    
}

export default App;
