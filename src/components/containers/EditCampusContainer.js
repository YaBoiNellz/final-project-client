/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { editCampusThunk } from '../../store/thunks';
import { fetchCampusThunk } from "../../store/thunks";

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    
    this.state = {
      name: "", 
      address: "", 
      description: "" ,
      imageUrl: "",
      redirect: false, 
      redirectId: null
    };
  }

  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id)
    .then(() => {
      // update the state once fetched from the store
      this.setState({
        name: this.props.campus.name, 
        address: this.props.campus.address, 
        description: this.props.campus.description,
        imageUrl: this.props.campus.imageUrl
      });
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({redirect: false, redirectId: null});
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value.trim()
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    if(!this.validateAll()){
      alert("Please ensure that you have filled all required fields correctly before proceeding");
      return;
    }
    
    let imageUrl = this.state.imageUrl;

    let campus = {
        id: this.props.match.params.id,
        name: this.state.name,
        address: this.state.address,
        description: this.state.description,
    };

    if(imageUrl.length){
      campus.imageUrl = imageUrl
    }else{
      campus.imageUrl = "https://thumbs.dreamstime.com/b/college-campus-students-school-high-university-building-student-house-entrance-vector-illustration-116016077.jpg";
    }
    
    // Edit the campus in back-end database
    await this.props.editCampus(campus);

    // Update state, and trigger redirect to the updated campus
    this.setState({
      name: "", 
      address: "", 
      description: "" ,
      imageUrl: "", 
      redirect: true, 
      redirectId: campus.id
    });
  }

  validateInput = (e) => {
    let name = e.target.name;
    let value = e.target.value.trim();

    if((name === "name" || name === "address") && value.length === 0){
      e.target.style.border = "1px solid red";
    }else{
      e.target.style.border = "initial";
    }
  }

  validateAll = () => {
    if(this.state.address === "" || this.state.name === ""){
      return false;
    }else{
      return true;
    }
  }

  // Render edit campus input form
  render() {
    // Redirect to new campus's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <EditCampusView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          validateInput={this.validateInput}
          campus={this.props.campus}       
        />
      </div>          
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "EditCampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};

// The following input argument is passed to the "connect" function used by "EditCampusContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
      fetchCampus: (id) => dispatch(fetchCampusThunk(id)),  
      editCampus: (campus) => dispatch(editCampusThunk(campus)),
    })
}

// Export store-connected container by default
// EditCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);