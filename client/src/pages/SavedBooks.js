import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useChange, useLazyQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/changes";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  
  const { loading } = useQuery(GET_ME, {
    onCompleted: (dt) => {
      setUserData(dt.me);
    },
  });

  const [removeBook, { removeBookError, removeBookData }] =
    useChange(REMOVE_BOOK);
  if (!Auth.loggedIn()) {
    return <h1>Please login to save books</h1>;
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }


  const userDataLength = Object.keys(userData).length;

  // created function which will accept the book's mongo_id value as param and then deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId: bookId },
      });

      console.log("remove book", data);
      setUserData(data.removeBook);
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };


  // if data isn't here yet, say so
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
