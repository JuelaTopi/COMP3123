import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import api, { getErrorMessage } from "../api/client";

const fields = [
  { name: "first_name", label: "First name", type: "text", maxLength: 100 },
  { name: "last_name", label: "Last name", type: "text", maxLength: 100 },
  { name: "email", label: "Email", type: "email", maxLength: 254 },
  { name: "position", label: "Position", type: "text", maxLength: 100 },
  { name: "department", label: "Department", type: "text", maxLength: 100 },
  { name: "salary", label: "Annual salary", type: "number" },
  { name: "date_of_joining", label: "Date of joining", type: "date" }
];

function EmployeeForm({ employee }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(() => ({
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    email: employee?.email || "",
    position: employee?.position || "",
    department: employee?.department || "",
    salary: employee?.salary ?? "",
    date_of_joining: employee?.date_of_joining?.slice(0, 10) || ""
  }));

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [validationError, setValidationError] = useState("");

  const backendOrigin = new URL(
    import.meta.env.VITE_API_URL,
    window.location.origin
  ).origin;

  let pictureUrl = preview;

  if (!pictureUrl && employee?.profile_picture) {
    pictureUrl = `${backendOrigin}${employee.profile_picture}`;
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const save = useMutation({
    mutationFn: async () => {
      const data = new FormData();

      for (const field of fields) {
        data.append(field.name, String(form[field.name]).trim());
      }

      if (file) data.append("profile_picture", file);

      if (employee) {
        return api.put(`/emp/employees/${employee._id}`, data);
      }

      return api.post("/emp/employees", data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["employees"]
      });

      if (employee) {
        await queryClient.invalidateQueries({
          queryKey: ["employee", employee._id]
        });
      }

      navigate("/employees", {
        state: {
          message: employee
            ? "Employee updated successfully."
            : "Employee added successfully."
        }
      });
    }
  });

  function handlePictureChange(event) {
    const selected = event.target.files?.[0];

    setValidationError("");
    save.reset();
    setFile(null);
    setPreview("");

    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setValidationError("Choose a JPEG, PNG or WebP picture.");
      event.target.value = "";
      return;
    }

    if (selected.size > 2 * 1024 * 1024) {
      setValidationError("Profile picture must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");
    save.reset();

    const missingField = fields.find(
      (field) => !String(form[field.name]).trim()
    );

    if (missingField) {
      setValidationError(`${missingField.label} is required.`);
      return;
    }

    if (
      !Number.isFinite(Number(form.salary)) ||
      Number(form.salary) <= 0
    ) {
      setValidationError("Salary must be a positive number.");
      return;
    }

    save.mutate();
  }

  return (
    <main className="container py-4">
      <Link to="/employees" className="d-inline-block mb-3">
        Back to employees
      </Link>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: 850 }}>
        <div className="card-body p-4">
          <h1 className="h3">
            {employee ? "Edit employee" : "Add employee"}
          </h1>
          <p className="text-secondary">
            Enter employment details and an optional profile picture.
          </p>

          {validationError && (
            <div className="alert alert-danger" role="alert">
              {validationError}
            </div>
          )}

          {save.error && (
            <div className="alert alert-danger" role="alert">
              {getErrorMessage(save.error)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <fieldset disabled={save.isPending}>
              <div className="row g-3">
                {fields.map((field) => (
                  <div className="col-md-6" key={field.name}>
                    <label htmlFor={field.name} className="form-label">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      className="form-control"
                      maxLength={field.maxLength}
                      step={field.type === "number" ? "any" : undefined}
                      value={form[field.name]}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          [field.name]: event.target.value
                        }))
                      }
                      required
                    />
                  </div>
                ))}

                <div className="col-12">
                  <label htmlFor="profilePicture" className="form-label">
                    Profile picture
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    className="form-control"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePictureChange}
                    aria-describedby="pictureHelp"
                  />
                  <div id="pictureHelp" className="form-text">
                    JPEG, PNG or WebP. Maximum 2 MB.
                  </div>
                </div>

                <div className="col-12">
                  {pictureUrl ? (
                    <img
                      src={pictureUrl}
                      alt="Employee profile preview"
                      className="rounded border"
                      width="120"
                      height="120"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-secondary">
                      No profile picture selected.
                    </div>
                  )}
                </div>

                <div className="col-12 d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    {save.isPending ? "Saving…" : "Save employee"}
                  </button>
                  <Link to="/employees" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function EmployeeFormPage() {
  const { id } = useParams();

  const { data: employee, isPending, error } = useQuery({
    queryKey: ["employee", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get(`/emp/employees/${id}`);
      return response.data.employee;
    }
  });

  if (id && isPending) {
    return (
      <main className="container py-4" role="status">
        Loading employee…
      </main>
    );
  }

  if (id && error) {
    return (
      <main className="container py-4">
        <div className="alert alert-danger" role="alert">
          {getErrorMessage(error)}
        </div>
        <Link to="/employees">Back to employees</Link>
      </main>
    );
  }

  return <EmployeeForm key={id || "new"} employee={employee} />;
}