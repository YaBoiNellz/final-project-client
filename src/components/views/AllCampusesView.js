/*==================================================
AllCampusesView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display all campuses.
================================================== */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';

const AllCampusesView = (props) => {
  const {allCampuses, deleteCampus} = props;
  
  // If there is no campus, display a message.
  if (!allCampuses.length) {
    return (
      <>
        <div>There are no campuses.</div>
        <Link to={`newcampus`}>
          <Button variant="contained">Add New Campus</Button>
        </Link>
      </>
    );
  }

  // If there is at least one campus, render All Campuses view 
  return (
    <div>
      <h1>All Campuses</h1>

      {props.allCampuses.map((campus) => (
        <div key={campus.id}>
          <Link to={`/campus/${campus.id}`}>
            <h2>{campus.name}</h2>
          </Link>

          <img src={campus.imageUrl} alt={campus.name} style={{maxWidth: "300px"}} />

          <h4>campus id: {campus.id}</h4>
          <p>{campus.address}</p>
          <p>{campus.description}</p>

          <Link to={`/campus/${campus.id}/edit`}>
            <Button variant="contained">Edit</Button>
          </Link>

          <br />
          <br />

          <Button variant="contained" color="secondary" onClick={() => deleteCampus(campus.id)}>Delete</Button>
          <hr/>
        </div>
      ))}
      <br/>
      <Link to={`newcampus`}>
        <Button variant="contained" color="primary">Add New Campus</Button>
      </Link>
      <br/><br/>
    </div>
  );
};

// Validate data type of the props passed to component.
AllCampusesView.propTypes = {
  allCampuses: PropTypes.array.isRequired,
};

export default AllCampusesView;