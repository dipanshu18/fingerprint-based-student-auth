import RegisterForm from "../components/RegisterForm";

export default function RegisterStudent() {
  return (
    <div className="flex flex-col justify-center items-center my-10">
      <h1 className="text-4xl text-center font-extrabold my-10">
        Get registered as a student for our attendance mgmt system
      </h1>

      <RegisterForm />
    </div>
  );
}
