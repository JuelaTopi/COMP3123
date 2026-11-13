import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import api, { getErrorMessage } from "../api/client";

export default function EmployeeList() {
  const location = useLocation();
  const queryClient = useQueryClient();

  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [filters, setFilters] = useState({});
  const [feedback, setFeedback] = useState("");

  const hasSearch = Object.keys(filters).length > 0;

  const {
    data: employees = [],
    isPending,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["employees", filters],
    queryFn: async ({ signal }) => {
      const endpoint = hasSearch
        ? "/emp/employees/search"
        : "/emp/employees";

      const response = await api.get(endpoint, {
        params: filters,
        signal
      });

      return response.data.employees;
    }
  });

  const deleteEmployee = useMutation({
    mutationFn: (employee) =>
      api.delete("/emp/employees", {
        params: { eid: employee._id }
      }),

    onSuccess: async (response, employee) => {
      queryClient.removeQueries({
        queryKey: ["employee", employee._id],
        exact: true
      });

      await queryClient.invalidateQueries({
        queryKey: ["employees"]
      });

      setFeedback(
        `${employee.first_name} ${employee.last_name} was deleted successfully.`
      );
    }
  });

  function handleSearch(event) {
    event.preventDefault();

    const nextFilters = {};

    if (department.trim()) {
      nextFilters.department = department.trim();
    }

    if (position.trim()) {
      nextFilters.position = position.trim();
    }

    setFilters(nextFilters);
  }

  function clearSearch() {
    setDepartment("");
    setPosition("");
    setFilters({});
  }

  function handleDelete(employee) {
    const confirmed = window.confirm(
      `Delete ${employee.first_name} ${employee.last_name}?`
    );

    if (confirmed) {
      setFeedback("");
      deleteEmployee.reset();
      deleteEmployee.mutate(employee);
    }
  }

  const backendOrigin = new URL(
    import.meta.env.VITE_API_URL,
    window.location.origin
  ).origin;

  const successMessage = feedback || location.state?.message;

  return (
    <main className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2">Employee directory</h1>
          <p className="text-secondary mb-0">
            Your team’s profiles and employment details.
          </p>
        </div>

        <Link to="/employees/add" className="btn btn-primary">
          Add employee
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success" role="status">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSearch} className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Search employees</h2>

          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="searchDepartment" className="form-label">
                Department
              </label>
              <input
                id="searchDepartment"
                className="form-control"
                placeholder="For example, Engineering"
                value={department}
                maxLength={100}
                onChange={(event) => setDepartment(event.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="searchPosition" className="form-label">
                Position
              </label>
              <input
                id="searchPosition"
                className="form-control"
                placeholder="For example, Developer"
                value={position}
                maxLength={100}
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>

            <div className="col-md-4 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isFetching}
              >
                Search
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearSearch}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </form>

      {isPending && <p role="status">Loading employees…</p>}

      {isFetching && !isPending && (
        <p role="status">Refreshing employees…</p>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <p>{getErrorMessage(error)}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            Try again
          </button>
        </div>
      )}

      {deleteEmployee.error && (
        <div className="alert alert-danger" role="alert">
          {getErrorMessage(deleteEmployee.error)}
        </div>
      )}

      {!isPending && !error && employees.length === 0 && (
        <div className="alert alert-info" role="status">
          {hasSearch
            ? "No employees match your search."
            : "No employees yet. Add your first employee to get started."}
        </div>
      )}

      {!isPending && !error && employees.length > 0 && (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <caption className="px-3">
                {employees.length} employee(s)
              </caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">Profile</th>
                  <th scope="col">Name</th>
                  <th scope="col">Position</th>
                  <th scope="col">Department</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      {employee.profile_picture ? (
                        <img
                          src={`${backendOrigin}${employee.profile_picture}`}
                          alt={`${employee.first_name} ${employee.last_name}`}
                          width="48"
                          height="48"
                          className="rounded-circle"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <span
                          className="badge rounded-pill text-bg-secondary p-3"
                          aria-label="No profile picture"
                        >
                          {employee.first_name.charAt(0)}
                          {employee.last_name.charAt(0)}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="fw-semibold">
                        {employee.first_name} {employee.last_name}
                      </span>
                      <div className="small text-secondary">
                        {employee.email}
                      </div>
                    </td>

                    <td>{employee.position}</td>
                    <td>{employee.department}</td>

                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link
                          to={`/employees/${employee._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View
                        </Link>

                        <Link
                          to={`/employees/${employee._id}/edit`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(employee)}
                          disabled={deleteEmployee.isPending}
                          aria-label={`Delete ${employee.first_name} ${employee.last_name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}