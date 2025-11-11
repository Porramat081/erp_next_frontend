import Swal from "sweetalert2";

export const errorSwal = (text: string, title?: string) => {
  return Swal.fire({
    icon: "error",
    title: title || "Error",
    text: text,
  });
};

export const confirmSwal = async (
  question: string,
  title?: string,
  icon?: string
) => {
  return await Swal.fire({
    icon: (icon as "warning") || "question",
    title: title || "Confirmation",
    text: question,
    showCancelButton: true,
    showConfirmButton: true,
  });
};

export const successSwal = async (
  text: string,
  title?: string,
  timer?: number
) => {
  return await Swal.fire({
    icon: "success",
    title: title || "Success",
    text: text,
    timer: timer,
  });
};
