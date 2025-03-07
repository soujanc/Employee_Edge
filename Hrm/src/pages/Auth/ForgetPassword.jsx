import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "../../hooks/useAuth";
import book2 from "../../assets/img/book2.jpg";
import Button2 from '../../components/button2';


const schema = z.object({
  email: z.string().email()
});

export function ForgetPassword() {
  const { resetPassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(data.email);
      setMessage('Check your inbox for further instructions.');
    } catch (e) {
      setError('Failed to reset password.');
    } finally {
      setTimeout(() => {
        setLoading(false);
        navigate('/newPass');
      }, 1000); // Set loading to false and navigate after 5 seconds
    }
  };

  return (
    <section
      className="bg-blue-600 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div
        className="w-full bg-white rounded-lg sm:max-w-md xl:p-0  mx-4">
        <div className="max-w-lg w-full mx-auto my-2 p-5">
        <h1 className="text-center text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset Password
          </h1>
          <form action="" className="my-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col space-y-5">
              <label htmlFor="email">
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                color="blue"
                {...register("email")}
              />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email.message}</div>}
              </label>
              <Button2
              label={isSubmitting ? "Loading..." : "Continue"}
              disabled={isSubmitting}
              type="submit"
            />
              <a
                className="flex justify-center text-black hover:text-blue-600 hover:underline hover:underline-offset-4 cursor-pointer text-sm"
                onClick={() => navigate('/login')}
              >
                <span >Return to Login Page</span>
              </a>
            </div>
          </form>
          </div>
        </div>
      
    </section>
  );
}

export default ForgetPassword;
