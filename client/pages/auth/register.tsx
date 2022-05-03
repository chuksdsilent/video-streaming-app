import {
  Button,
  Container,
  Header,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import Head from "next/head";
import React from "react";
import { useMutation } from "react-query";

import { registerUser } from "../../api";

const Registerapage = () => {
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const mutation = useMutation<
    string,
    AxiosError,
    Parameters<typeof registerUser>["0"]
  >(registerUser, {
    onMutate: () => {
      showNotification({
        id: "register",
        title: "Creating Account...",
        message: "Please wait...",
        loading: true,
      });
    },
    onSuccess: () => {
      showNotification({
        id: "register",
        title: "Successful",
        message: "Account Created Successfully...",
      });
    },
    onError: () => {
      showNotification({
        id: "register",
        title: "Error",
        message: "Could not create account...",
      });
    },
  });
  return (
    <>
      <Container>
        <Head>
          <title>Register User</title>
        </Head>

        <Title>Regiter</Title>
        <Paper shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
            <Stack>
              {" "}
              <TextInput
                label="Email"
                placeholder="Email"
                required
                {...form.getInputProps("email")}
              />
              <TextInput
                label="Username"
                placeholder="Username"
                required
                {...form.getInputProps("username")}
              />
              <TextInput
                label="Password"
                placeholder="Password"
                required
                {...form.getInputProps("password")}
              />
              <TextInput
                label="Confirm Password"
                placeholder="Confirm Password"
                required
                {...form.getInputProps("confirmPassword")}
              />
              <Button type="submit">Register</Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Registerapage;
