import { useState } from 'react';
import './App.css';

const provinces = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
];

function App() {
  const [submitted, setSubmitted] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitted(Object.fromEntries(formData));
  }

  return (
    <main>
      <h1>Data Entry Form</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input type="email" name="email" placeholder="Enter email" required />
          </label>

          <label>
            Name
            <input type="text" name="fullName" placeholder="Full Name" required />
          </label>
        </div>

        <div>
          <label>
            Address
            <input type="text" name="address" placeholder="1234 Main St" required />
          </label>
        </div>

        <div>
          <label>
            Address 2
            <input type="text" name="address2" placeholder="Apartment, studio, or floor" />
          </label>
        </div>

        <div>
          <label>
            City
            <input type="text" name="city" required />
          </label>

          <label>
            Province
            <select name="province" defaultValue="" required>
              <option value="" disabled>Choose...</option>
              {provinces.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </label>

          <label>
            Postal Code
            <input type="text" name="postalCode" required />
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" required />
            Agree Terms &amp; Condition?
          </label>
        </div>

        <button type="submit">Submit</button>
      </form>

      {submitted && (
        <table aria-label="Submitted information">
          <tbody>
            <tr><th scope="row">Email:</th><td>{submitted.email}</td></tr>
            <tr><th scope="row">Full Name:</th><td>{submitted.fullName}</td></tr>
            <tr>
              <th scope="row">Address:</th>
              <td>{[submitted.address, submitted.address2].filter(Boolean).join(', ')}</td>
            </tr>
            <tr><th scope="row">City:</th><td>{submitted.city}</td></tr>
            <tr><th scope="row">Province:</th><td>{submitted.province}</td></tr>
            <tr><th scope="row">Postal Code:</th><td>{submitted.postalCode}</td></tr>
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;