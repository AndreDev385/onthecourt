import { Form, Link, useNavigation } from "@remix-run/react";
import React from "react";
import { Textarea } from "~/components/ui/textarea";
import { ProductComment } from "./comment";
import { ProductRating } from "./productRating";
import { Button } from "~/components/ui/button";

type Props = {
  user?: {
    _id: string;
    name: string;
  };
  comments: {
    _id: string;
    text: string;
    rating: number;
    client: {
      name: string;
    };
  }[];
  productId: string;
};

export function ProductCommentsSection({ comments, user, productId }: Props) {
  const [rating, setRating] = React.useState(0);

  const navigation = useNavigation();
  const submitting =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "comment";

  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (submitting) {
      setRating(5);
      formRef.current?.reset();
    }
  }, [submitting]);

  return (
    <div className="container mx-auto w-full flex flex-col my-12">
      {comments?.length > 0 ? (
        <>
          <h3 className="mb-6 text-xl leading-normal text-gray-600">
            Opiniones de clientes
          </h3>
          <section className="flex flex-col flex-wrap w-full">
            {comments?.map((comment) => (
              <ProductComment key={comment?._id} comment={comment} />
            ))}
          </section>
        </>
      ) : (
        <h3 className="mb-6 text-xl leading-normal text-gray-600">
          Sé el primero en opinar sobre este producto
        </h3>
      )}
      {user ? (
        <Form
          method="POST"
          className="flex flex-col px-4 py-4 rounded border border-gray-200"
          ref={formRef}
        >
          <input type="hidden" name="userId" value={user?._id} />
          <input type="hidden" name="productId" value={productId} />
          <div className="w-full inline-flex mb-2 text-sm leading-normal">
            <p className="my-auto mr-2 text-gray-600">
              {user?.name ?? "Anónimo"}
            </p>
            <input type="hidden" name="rating" value={rating} />
            <ProductRating rating={rating} setRating={setRating} />
          </div>
          <label htmlFor="opinion" className="block">
            <Textarea
              name="opinion"
              className="form-textarea mt-1 block w-full"
              placeholder="Escriba la reseña de este producto"
              rows={5}
              required
            />
          </label>
          <Button type="submit" name="intent" value="comment" className="mt-4">
            Comentar
          </Button>
        </Form>
      ) : (
        <Link
          to="/store/sign-in"
          className="rounded text-center bg-primary text-white cursor-pointer px-4 py-2 mr-auto"
        >
          Iniciar Sesión
        </Link>
      )}
    </div>
  );
}
