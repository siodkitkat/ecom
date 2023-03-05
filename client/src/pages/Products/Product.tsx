import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import { z } from "zod";
import Button from "../../components/Button";
import Dialog from "../../components/Dialog";
import { ControlledDialogProps } from "../../components/Dialog/ControlledDialog";
import EditIcon from "../../components/icons/EditIcon";
import Textarea from "../../components/Textarea";
import useAuth from "../../hooks/useAuth";
import { ProductSchema } from "../../types";
import { TIME_IN_MS } from "../../utils";

type EditableProductFields = Exclude<keyof z.infer<typeof ProductSchema>, "_id" | "image" | "User">;

const ProductEditDialog = ({
  value,
  fieldToEdit,
  open,
  setOpen,
  productId,
  onSuccess,
  onSettled,
  onDiscard,
}: {
  value: string;
  fieldToEdit: EditableProductFields;
  open: ControlledDialogProps["open"];
  setOpen: ControlledDialogProps["setOpen"];
  productId: string;
  onSuccess: () => void;
  onSettled: () => void;
  onDiscard: () => void;
}) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (value: string) => {
      if (isLoading) {
        throw new Error("Waiting for previous mutation to finish.");
      }
      const req = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        body: new URLSearchParams({
          [fieldToEdit]: value,
        }),
      });

      if (!req.ok) {
        throw new Error("Failed to edit.");
      }

      return true;
    },
    onSettled: () => {
      onSettled();
    },
    onSuccess: () => {
      //To do throw a toast here
      console.log("Successfully edited");
      onSuccess();
    },
  });

  const handleEdit = async () => {
    mutate(value);
  };

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      title={`Edit this product's ${fieldToEdit}`}
      description="Are you sure you want to do this ?"
    >
      <Button onClick={() => setOpen(false)} disabled={isLoading}>
        Keep editing
      </Button>
      <Button
        onClick={() => {
          onDiscard();
        }}
        disabled={isLoading}
      >
        Discard Changes
      </Button>
      <Button onClick={handleEdit} disabled={isLoading}>
        Save changes
      </Button>
    </Dialog>
  );
};

const EditableText = ({
  children,
  canEdit,
  as = <p />,
  inputElement = "textarea",
  fieldToEdit,
  productId,
  onChangeComplete,
  onSuccess,
  className = "",
  ...rest
}: Omit<React.ComponentProps<"p">, "children"> & {
  children: string;
  canEdit: boolean;
  as?: React.ReactElement;
  inputElement?: "textarea" | "input";
  fieldToEdit: EditableProductFields;
  productId: string;
  onChangeComplete?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSuccess: () => void;
}) => {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  const [diagOpen, setDiagOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleStopEditing = () => {
    setEditing(false);
    setDiagOpen(false);
  };

  const handleBlur = () => {
    if (children.trim() !== text.trim()) {
      //To do create a dialog and replace alert with it
      setDiagOpen(true);
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
    onBlur: handleBlur,
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
          {canEdit ? (
            <button
              className="visible ml-2 align-baseline opacity-50 transition-all duration-300 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 xl:invisible xl:opacity-0"
              onClick={() => {
                flushSync(() => setText(children));
                setEditing(true);
              }}
            >
              <EditIcon className="h-full w-6 md:w-8" />
            </button>
          ) : null}
        </>
      )}
      <ProductEditDialog
        onSuccess={onSuccess}
        onSettled={handleStopEditing}
        onDiscard={handleStopEditing}
        open={diagOpen}
        setOpen={setDiagOpen}
        fieldToEdit={fieldToEdit}
        value={text}
        productId={productId}
      />
    </div>
  );
};

const ProductDeleteDialog = ({ canEdit, productId }: { canEdit: boolean; productId: string }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: deleteProduct, isLoading } = useMutation(["product-delete", productId], {
    mutationFn: async () => {
      if (isLoading) {
        throw new Error("Waiting for previous mutation to finish.");
      }
      const req = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!req.ok) {
        throw new Error("Failed to delete this product.");
      }

      return true;
    },
    onSuccess: async () => {
      //To do throw up a snackbar to notify
      console.log("Deleted");
    },
  });

  const handleDelete = async () => {
    await deleteProduct();
    setOpen(false);
  };

  return canEdit ? (
    <Dialog
      Opener={<Button>Delete</Button>}
      open={open}
      setOpen={setOpen}
      title={"Delete this product"}
      description="Are you sure you want to do this ?"
    >
      <Button onClick={() => setOpen(false)}>No</Button>
      <Button onClick={handleDelete} disabled={isLoading}>
        Yes
      </Button>
    </Dialog>
  ) : null;
};

const Product = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: product, refetch: refetchProduct } = useQuery(["product-get", id], {
    queryFn: async () => {
      const req = await fetch(`/api/products/${id}`);

      if (!req.ok) {
        throw new Error("Failed to get the requested product.");
      }

      return ProductSchema.parse((await req.json())?.product);
    },
    staleTime: TIME_IN_MS.FIVE_MINUTES,
  });

  if (!product) {
    //To do add proper error handling
    return <div>Product doesnt exist</div>;
  }

  const canEdit = product.User === user?._id;

  const handleEditComplete = () => {
    refetchProduct();
  };

  /* To do fetch  */

  return (
    <div className="w-full">
      <div className="flex flex-col items-baseline gap-4 p-4 md:gap-8 md:p-12 xl:flex-row">
        <img
          className="w-[35rem] self-center rounded-sm object-cover"
          src={product.image[0]?.publicUrl ?? ""}
          style={{ aspectRatio: "1 / 1" }}
        />
        <div className="flex w-full flex-col items-baseline gap-2 p-1 md:gap-4 xl:py-8 xl:px-4">
          <div className="flex w-full flex-col gap-2 text-2xl text-zinc-200 md:gap-4 md:text-4xl">
            <EditableText
              className="font-bold md:text-5xl"
              productId={product._id}
              canEdit={canEdit}
              fieldToEdit={"title"}
              onSuccess={handleEditComplete}
            >
              {product.title}
            </EditableText>
            <div className="flex items-center">
              <p>$</p>
              <EditableText
                className="font-medium tracking-wider text-zinc-300"
                productId={product._id}
                canEdit={canEdit}
                fieldToEdit={"price"}
                onSuccess={handleEditComplete}
                inputElement="input"
              >
                {`${product.price}`}
              </EditableText>
            </div>
          </div>
          <EditableText
            className="w-full text-lg text-zinc-400 md:text-2xl 2xl:max-w-[55%]"
            productId={product._id}
            canEdit={canEdit}
            fieldToEdit={"body"}
            onSuccess={handleEditComplete}
            as={<p className="" />}
          >
            {`${product.body}`}
          </EditableText>

          <Dialog
            Opener={<Button className="mt-4 bg-teal-600 py-1 px-2 md:mt-2">Buy</Button>}
            title="Whoops"
            description="This site is meant to be a demo. You can't actually purchase anything from here sorry :/"
          />
          <ProductDeleteDialog canEdit={canEdit} productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default Product;
