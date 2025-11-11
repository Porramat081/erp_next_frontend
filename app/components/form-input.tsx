interface FormInputProps {
  title: string;
  value: string | number;
  setValue: (newValue: string | number) => void;
  placeholder: string;
  icon: string;
  isPassword?: boolean;
  required?: boolean;
  isNumber?: boolean;
}

export default function FormInput(props: FormInputProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        <i className={props.icon && `fas ${props.icon} mr-2`}></i>
        {props.title}
      </label>
      <input
        required={props.required}
        type={
          props.isPassword ? "password" : props.isNumber ? "number" : "text"
        }
        className="form-input"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      />
    </div>
  );
}
