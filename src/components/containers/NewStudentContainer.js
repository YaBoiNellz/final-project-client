/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk, fetchAllCampusesThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "", 
      email: "" ,
      imageUrl: "",
      campusId: null,
      gpa: null, 
      redirect: false, 
      redirectId: null
    };
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value.trim()
    });
  }

  // validate the user input
  validateInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if(name === "firstname" || name === "lastname" || name === "email"){
      if(value.length === 0){
        e.target.style.border = "1px solid red";
      }else{
        e.target.style.border = "initial";
      }
      
    }else if(name === "gpa"){
      if(this.isValidGPA(value)){
        e.target.style.border = "initial";
      }else{
        e.target.style.border = "1px solid red";
      }
    }
  }

  // check if the gpa provided is valid
  isValidGPA = (value) => {
    if(isNaN(value)){
      return false;
    }else{
      value = parseFloat(value);
      if(value < 0 || value > 4){
        return false;
      }else{
        return true;
      }
    }
  }

  validateAll = () => {
    if(this.state.firstname === "" || this.state.lastname === "" || this.state.email === ""){
      return false;
    }

    if((this.state.gpa !== null || this.state.gpa !== "") && !this.isValidGPA(this.state.gpa)){
      return false;
    }
    
    return true;
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    if(!this.validateAll()){
      alert("Please ensure that you have filled all required fields correctly before proceeding");
      return;
    }

    if(this.state.campusId === ""){
      this.setState({
        campusId: null,
      });
    }

    let imageUrl = this.state.imageUrl;
    
    let student = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        email: this.state.email,
        campusId: this.state.campusId,
        gpa: this.state.gpa,
    };

    if(imageUrl.length){
      student.imageUrl = imageUrl;
    }else{
      student.imageUrl = "https://img.freepik.com/free-vector/learning-concept-illustration_114360-3896.jpg?w=2000";
    }
    
    // Add new student in back-end database
    let newStudent = await this.props.addStudent(student);

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "", 
      lastname: "",
      email: "",
      imageUrl: "",
      campusId: null,
      gpa: null, 
      redirect: true, 
      redirectId: newStudent.id
    });
  }

  // Get all campuses data from back-end database
  componentDidMount() {
    this.props.fetchAllCampuses();
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          validateInput={this.validateInput}
          allCampuses={this.props.allCampuses}      
        />
      </div>          
    );
  }
}

// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "allCampuses".
// The following 2 input arguments are passed to the "connect" function used by "AllCampusesContainer" component to connect to Redux Store.
const mapState = (state) => {
  return {
    allCampuses: state.allCampuses,  // Get the State object from Reducer "allCampuses"
  };
};  

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
        fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(NewStudentContainer);