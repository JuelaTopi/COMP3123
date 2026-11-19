import React, { Component } from "react";
import axios from "axios";
import { Card, Row, Col, Image, Button } from "react-bootstrap";

class PersonList extends Component {
  state = {
    persons: [],
    loading: true,
    error: "",
  };

  componentDidMount() {
    axios
      .get("https://randomuser.me/api/?results=10")
      .then((res) => {
        console.log(res.data);
        this.setState({
          persons: res.data.results,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          error: "Unable to load users. Please refresh to try again.",
          loading: false,
        });
      });
  }

  render() {
    const { persons, loading, error } = this.state;

    return (
      <div>
        <h1 className="bg-success text-center p-4">User List</h1>

        {loading && <p className="text-center">Loading users...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="p-3">
          {persons.map((person) => (
            <Card
              key={person.login.uuid}
              className="mb-3"
              style={{ backgroundColor: "#17a2b8" }}
            >
              <Card.Header className="fw-bold">
                {person.name.title} {person.name.first} {person.name.last}
                {" - "}
                {person.login.uuid}
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <Image
                      src={person.picture.large}
                      alt={`${person.name.first} ${person.name.last}`}
                      roundedCircle
                      width={180}
                      height={180}
                      className="mb-3"
                    />
                    <div>
                      <Button
                        onClick={() =>
                          alert(
                            `${person.name.first} ${person.name.last}\n${person.email}`
                          )
                        }
                      >
                        Details
                      </Button>
                    </div>
                  </Col>

                  <Col md={9}>
                    <p><strong>User Name:</strong> {person.login.username}</p>
                    <p><strong>Gender:</strong> {person.gender.toUpperCase()}</p>
                    <p>
                      <strong>Time Zone Description:</strong>{" "}
                      {person.location.timezone.description}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {person.location.street.number} {person.location.street.name},
                      {" "}{person.location.city}, {person.location.state},
                      {" "}{person.location.country} - {person.location.postcode}
                    </p>
                    <p><strong>Email:</strong> {person.email}</p>
                    <p>
                      <strong>Birth Date and Age:</strong>{" "}
                      {person.dob.date} ({person.dob.age})
                    </p>
                    <p><strong>Register Date:</strong> {person.registered.date}</p>
                    <p><strong>Phone#:</strong> {person.phone}</p>
                    <p><strong>Cell#:</strong> {person.cell}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}

export default PersonList;