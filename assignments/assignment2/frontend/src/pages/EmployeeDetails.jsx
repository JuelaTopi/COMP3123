import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import api, { getErrorMessage } from "../api/client";

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: employee,
    isPending,
    error
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const response = await api.get(`/emp/employees/${id}`);
      return response.data.employee;
    }
  });

  const deleteEmployee = useMutation({
    mutationFn: () =>
      api.delete("/emp/employees", {
        params: { eid: id }
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["employees"]
      });

      navigate("/employees", {
        replace: true,
        state: { message: "Employee deleted successfully." }
      });

      queryClient.removeQueries({
        queryKey: ["employee", id],
        exact: true
      });
    }
  });

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${employee.first_name} ${employee.last_name}?`
    );

    if (confirmed) deleteEmployee.mutate();
  }

  if (isPending) {
    return (
      <main className="container py-4" role="status">
        Loading employee…
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-4">
        <div className="alert alert-danger" role="alert">
          {getErrorMessage(error)}
        </div>
        <Link to="/employees">Back to employees</Link>
      </main>
    );
  }

  const backendOrigin = new URL(
    import.meta.env.VITE_API_URL,
    window.location.origin
  ).origin;

  const salary = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(employee.salary);

  const joiningDate = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: "UTC"
  }).format(new Date(employee.date_of_joining));

  return (
    <main className="container py-4">
      <Link to="/employees" className="d-inline-block mb-3">
        Back to employees
      </Link>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: 800 }}>
        <div className="card-body p-4">
          <h1 className="h3">Employee details</h1>

          {deleteEmployee.error && (
            <div className="alert alert-danger" role="alert">
              {getErrorMessage(deleteEmployee.error)}
            </div>
          )}

          <div className="d-flex flex-wrap align-items-center gap-4 my-4">
            {employee.profile_picture ? (
              <img
                src={`${backendOrigin}${employee.profile_picture}`}
                alt={`${employee.first_name} ${employee.last_name}`}
                width="120"
                height="120"
                className="rounded border"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span
                className="badge text-bg-secondary p-4 fs-3"
                aria-label="No profile picture"
              >
                {employee.first_name.charAt(0)}
                {employee.last_name.charAt(0)}
              </span>
            )}

            <div>
              <h2 className="h4">
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="text-secondary mb-0">
                {employee.position}
              </p>
            </div>
          </div>

          <dl className="row">
            <dt className="col-sm-4">Email</dt>
            <dd className="col-sm-8">{employee.email}</dd>

            <dt className="col-sm-4">Department</dt>
            <dd className="col-sm-8">{employee.department}</dd>

            <dt className="col-sm-4">Annual salary (CAD)</dt>
            <dd className="col-sm-8">{salary}</dd>

            <dt className="col-sm-4">Date of joining</dt>
            <dd className="col-sm-8">{joiningDate}</dd>
          </dl>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <Link
              to={`/employees/${id}/edit`}
              className="btn btn-primary"
            >
              Edit employee
            </Link>

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleDelete}
              disabled={deleteEmployee.isPending}
            >
              {deleteEmployee.isPending
                ? "Deleting…"
                : "Delete employee"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}