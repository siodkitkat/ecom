import React, { useState } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import EditIcon from "../../components/icons/EditIcon";
import Textarea from "../../components/Textarea";

const img = "https://m.media-amazon.com/images/I/41I3dqoDN9L._SL1000_.jpg";

const EditableText = ({
  children,
  as = <p />,
  inputElement = "textarea",
  onChangeComplete,
  className = "",
  ...rest
}: Omit<React.ComponentProps<"p">, "children"> & {
  children: string;
  as?: React.ReactElement;
  inputElement?: "textarea" | "input";
  onChangeComplete?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}) => {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleStopEditing = () => {
    setEditing(false);
    if (children.trim() !== text.trim()) {
      //To do create a dialog and replace alert with it
      alert("Are you sure about dat ?");
    }
  };

  const textElProps = {
    className: "w-full resize-none rounded-sm bg-transparent p-2 focus:outline focus:outline-2 focus:outline-blue-400",
    autoFocus: true,
    value: text,
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setText(e.currentTarget.value);
      if (onChangeComplete) {
        onChangeComplete(e);
      }
    },
    onKeyDown: handleKeyDown,
    onBlur: handleStopEditing,
  };

  return (
    <div {...rest} className={`group relative ${className}`}>
      {editing ? (
        inputElement === "textarea" ? (
          <Textarea {...textElProps} autoResize cursorToTextEndOnFocus />
        ) : (
          <input {...textElProps} />
        )
      ) : (
        <>
          {React.cloneElement(as, {
            ...as.props,
            className: `inline ${as.props.className ?? ""}`,
            children: children,
          })}
          <button
            className="visible ml-2 align-baseline opacity-50 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 xl:invisible xl:opacity-0"
            onClick={() => {
              flushSync(() => setText(children));
              setEditing(true);
            }}
          >
            <EditIcon className="h-full w-6 md:w-8" />
          </button>
        </>
      )}
    </div>
  );
};

const Product = () => {
  const { id } = useParams();

  /* To do fetch  */

  return (
    <div className="w-full">
      <div className="flex flex-col items-baseline gap-4 p-4 md:gap-8 md:p-12 xl:flex-row">
        <img className="w-[35rem] self-center rounded-sm object-cover" src={img} style={{ aspectRatio: "1 / 1" }} />
        <div className="flex w-full flex-col items-baseline gap-2 p-1 md:gap-4 xl:py-8 xl:px-4">
          <div className="flex w-full flex-col gap-2 text-2xl text-zinc-200 md:gap-4 md:text-4xl">
            <EditableText className="font-bold md:text-5xl">
              Very long Very cute Very poggers very peepoc cat long doll
            </EditableText>
            <EditableText className="font-medium tracking-wider text-zinc-300" inputElement="input">
              $5000000000
            </EditableText>
          </div>
          <EditableText className="w-full text-lg text-zinc-400 md:text-2xl 2xl:max-w-[55%]" as={<p className="" />}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus est voluptate facilis ab ratione.
            Molestiae molestias, error obcaecati sequi voluptatibus non. Vel pariatur at voluptatibus temporibus
            adipisci aperiam voluptatem neque?
          </EditableText>

          <Dialog
            Opener={<Button className="mt-4 bg-teal-600 py-1 px-2 md:mt-2">Buy</Button>}
            title="Kekw"
            description="some desc"
          ></Dialog>
        </div>
      </div>
    </div>
  );
};

export default Product;
