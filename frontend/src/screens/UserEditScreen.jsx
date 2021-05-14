import React, { useEffect, useState } from "react";
import { Button, Form} from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUser } from "../actions/userActions";
import Message from "../components/Message";
import Preloader from "../components/Preloader";
import { USER_UPDATE_RESET } from "../constants/userConstants";



const UserEditScreen = ({ match, history }) => {

  const userId = match.params.id

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setAdmin] = useState(false);


  const dispatch = useDispatch();


  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { error:errorUpdate, success:successUpdate, loading:loadingUpdate } = userUpdate;

  useEffect(() => {

    if(successUpdate){
      dispatch({type:USER_UPDATE_RESET})
      history.push('/admin/userlist')
    }else{
      if(!user.name || user._id !== Number(userId)){
        dispatch(getUserDetails(userId))
   }else{
       setName(user.name)
       setEmail(user.email)
       setAdmin(user.isAdmin)
   }
    }
  }, [dispatch, user, userId, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({
      _id:user._id, name, email, isAdmin
    }))


  };

  return (
  <div>
      <Link to='/admin/userlist'>
      Go Back
      </Link>
    <FormContainer>
      <h1>Edit User</h1>
    {loadingUpdate && <Preloader/>}
    {errorUpdate && (<Message variant='danger'>{errorUpdate}</Message>)}

{loading ? (<Preloader/>) : error ? (<Message variant='danger'>{error}</Message>) 
: (
    <Form onSubmit={submitHandler}>
    <Form.Group controlId="name">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="name"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></Form.Control>
    </Form.Group>

    <Form.Group controlId="email">
      <Form.Label>Email Address</Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></Form.Control>
    </Form.Group>

    <Form.Group controlId="isAdmin">
      <Form.Check
        type="checkbox"
        label="Is Admin"
        checked={isAdmin}
        onChange={(e) => setAdmin(e.target.checked)}
      ></Form.Check>
    </Form.Group>

    <Button type='submit' variant='primary'>
                Update
                </Button>
  </Form>
)}
    </FormContainer>
  </div>
  );
};

export default UserEditScreen;
