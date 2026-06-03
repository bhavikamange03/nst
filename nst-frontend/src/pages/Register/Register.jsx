function Register() {
  return (
    <div>
      <h1>Register</h1>

      <form>
        <input
          type="text"
          placeholder="Name"
        />

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
        />

        <button>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;