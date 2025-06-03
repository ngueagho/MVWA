import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";

import {
  Dialog,
  Disclosure,
  Popover,
  RadioGroup,
  Tab,
  Transition,
} from "@headlessui/react";
import {
  CheckIcon,
  StarIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import {
  getProductDescription,
  getProductDescriptionSecure,
  Media,
} from "../utils/utils";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDescription() {
  const router = useRouter();
  const trpcBuyNow = trpc.useMutation(["order.placeOrder"]);
  const trpcAddToCart = trpc.useMutation(["cart.addItem"]);
  const trpcSaveForLatter = trpc.useMutation([
    "product.savedForLatter.addItem",
  ]);
  const trpcWriteReview = trpc.useMutation([
    "product.review.protected.createProductReview",
  ]);
  const trpcUpdateReview = trpc.useMutation([
    "product.review.protected.updateProductReview",
  ]);
  const trpcDeleteReview = trpc.useMutation([
    "product.review.protected.deleteProductReview",
  ]);
  const [productId, setProductId] = useState("");
  const [productSKUId, setProductSKUId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState<any | null>(null);
  const [productInventories, setProductInventories] = useState<any | null>(
    null
  );
  const [reviews, setReviews] = useState<any | null>(null);
  const [overallReview, setOverallReview] = useState<any | null>(null);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewId, setReviewId] = useState("");
  const [reload, setReload] = useState(false);
  useEffect(() => {
    if (router.isReady) setProductId(router.query.id as string);
  }, [router]);

  trpc.useQuery(["product.getProductDetails", { productId }], {
    enabled: productId !== "",
    onSuccess: (data) => {
      // console.log(data);
      setProduct(data);
      setProductSKUId(data.ProductSKU[0]?.productSKUId ?? "");
      setStatus("loaded");
    },
    onError: (error) => {
      console.log(error);
      setStatus("error");
    },
  });

  trpc.useQuery(["product.review.protected.getProductReview", productId], {
    enabled: productId !== "",
    onSuccess: (data) => {
      // console.log(data);
      if (data) {
        setReviewId(data.productReviewId);
        setReviewContent(data.content);
        setReviewRating(data.overallRating);
      } else {
        setReviewId("noreview");
        setReviewContent("");
        setReviewRating(0);
      }
      // setStatus("loaded");
    },
    onError: (error) => {
      console.log(error, "no rev check");
      setReviewId("noreview");
      setReviewContent("");
      setReviewRating(0);
      // setStatus("error");
    },
  });

  trpc.useQuery(
    ["product.inventory.getProductInventories", { productSKUId: productSKUId }],
    {
      enabled: productSKUId !== null,
      onSuccess: (data) => {
        // console.log(data);
        setProductInventories(data);
        // setStatus("loaded");
      },
      onError: (error) => {
        console.log(error);
        setStatus("error");
      },
    }
  );

  trpc.useQuery(["product.review.getProductReviewsForProduct", productId], {
    enabled: productId !== "",
    onSuccess: (data) => {
      console.log(data);
      setReviews(data);
      // setStatus("loaded");
    },
    onError: (error) => {
      console.log(error);
      // setStatus("error");
    },
  });

  trpc.useQuery(["product.review.getProductOverallReview", productId], {
    enabled: productId !== "",
    onSuccess: (data) => {
      // console.log(data);
      setOverallReview(data);
      // setStatus("loaded");
    },
    onError: (error) => {
      console.log(error);
      setStatus("error");
    },
  });

  function writeProductReview() {
    trpcWriteReview.mutate(
      {
        productId: productId,
        content: reviewContent,
        overallRating: reviewRating,
        features: [],
        tags: [],
        media: [],
      },
      {
        onSuccess: (data) => {
          console.log(data);
          if (data) {
            setReload(!reload);
            setReviewId(data.productReviewId);
          }
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }

  function updateProductReview() {
    console.log(reviewId);
    trpcUpdateReview.mutate(
      {
        productReviewId: reviewId,
        content: reviewContent,
        overallRating: reviewRating,
        features: [],
        tags: [],
        media: [],
      },
      {
        onSuccess: (data) => {
          setReload(!reload);
          console.log(data);
        },
        onError: (error) => {
          // alert("Something went wrong");
          console.log(error);
        },
      }
    );
  }

  function deleteProductReview() {
    trpcDeleteReview.mutate(reviewId, {
      onSuccess: (data) => {
        setReviewId("noreview");
        setReviewContent("");
        setReviewRating(0);
        setReload(!reload);
        // console.log(data);
      },
      onError: (error) => {
        // alert("Something went wrong, cant delete review, please try again..");
      },
    });
  }

  function buyNow() {
    // console.log("buy now", product.ProductSKU[0].productInventoryIds[0]);
    trpcBuyNow.mutate(
      {
        productId: product.ProductSKU[0].productInventoryIds[0],
        quantity: quantity,
        receiver: {
          name: "RecieverCheck",
          contact: "1234567890",
        },
        newDeliveryAddress: {
          line1: "line1",
          line2: "line2",
          city: "Delhi",
          state: "Delhi",
          country: "IN",
          zipcode: "110001",
          addressType: "NORMAL",
        },
      },
      {
        onSuccess: (data) => {
          // console.log(data);
        },
        onError: (error) => {
          alert("Cant place order, please try again..");
          console.log(error);
        },
      }
    );
  }

  function addToCart() {
    trpcAddToCart.mutate(
      {
        productId: product.ProductSKU[0].productSKUId,
        // productInventoryId: product.ProductSKU[0].productInventoryIds[0],
        quantity: quantity,
      },
      {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (error) => {
          alert("Cant add to cart, please try again..");
          console.log(error);
        },
      }
    );
  }

  function saveForLatter() {
    trpcSaveForLatter.mutate(productId, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        alert("Cant save for latter, please try again..");
        console.log(error);
      },
    });
  }

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error</div>;
  return (
    <div className="bg-gray-50">
      <Navbar></Navbar>
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-5 gap-6">
                  {product.Media.map((media) => (
                    <Tab
                      key={media.mediaId}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only"> {media.name} </span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <Media
                              key={media.mediaId}
                              media={media.mediaId}
                            ></Media>
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                {product.Media.map((media) => (
                  <Tab.Panel key={media.mediaId}>
                    <Media key={media.mediaId} media={media.mediaId}></Media>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="mt-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {product.name}
                </h1>
              </div>

              <section aria-labelledby="information-heading" className="mt-4">
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>

                <div className="flex items-center">
                  <p className="text-lg text-gray-900 sm:text-xl">
                    Price: {productInventories && productInventories[0].price}
                    (INR)
                  </p>

                  <div className="ml-4 border-l border-gray-300 pl-4">
                    <h2 className="sr-only">Reviews</h2>
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                overallReview.rating > rating
                                  ? "text-yellow-400"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="sr-only">
                          {reviews.average} out of 5 stars
                        </p>
                      </div>
                      <p className="ml-2 text-sm text-gray-500">
                        {reviews.totalCount} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-base text-gray-500">
                    {/* {product.description} */}
                    {getProductDescription(product.description)}
                    {/* {getProductDescriptionSecure(product.description)} */}
                  </p>
                </div>

                {productInventories && productInventories[0].stock !== 0 ? (
                  <div className="mt-6 flex items-center">
                    <CheckIcon
                      className="h-5 w-5 flex-shrink-0 text-green-500"
                      aria-hidden="true"
                    />
                    <p className="ml-2 text-sm text-gray-500">
                      In stock and ready to ship
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center">
                    <XIcon
                      className="h-5 w-5 flex-shrink-0 text-red-500"
                      aria-hidden="true"
                    />
                    <p className="ml-2 text-sm text-gray-500">Out of stock</p>
                  </div>
                )}
              </section>

              {/* Product form */}
              <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
                <section aria-labelledby="options-heading">
                  <form>
                    <div className="mt-10">
                      <button
                        onClick={() => {
                          buyNow();
                        }}
                        type="button"
                        className="flex w-full m-5 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => {
                          addToCart();
                        }}
                        type="button"
                        className="flex w-full m-5 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          saveForLatter();
                        }}
                        type="button"
                        className="flex w-full  m-5 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Save For Later
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
        {product.Details && product.Details.length != 0 && (
          <div className="mx-auto max-w-2xl lg:max-w-none p-10 m-10">
            <div>
              <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
                Details
              </h2>
            </div>
            <div>
              {/* Details section */}
              {product.Details.map((detail) => (
                <div
                  className="flex flex-col text-center"
                  aria-labelledby="details-heading"
                  key={detail.productDetailId}
                >
                  {/* <div className="flex flex-col text-center"> */}
                  <div>
                    <h2
                      id="details-heading"
                      className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center"
                    >
                      {detail.heading}
                    </h2>
                    <p className="text-lg text-gray-600 text-center">
                      {detail.description}
                    </p>
                    {/* {detail.Media &&
                      detail.Media.length !== 0 &&
                      detail.Media.map((media) => (
                        <Media
                          key={media.mediaId}
                          media={media.mediaId}
                        ></Media>
                      ))} */}
                    {detail.Media && detail.Media.length === 1 ? (
                      <div>
                        <Media media={detail.Media[0].mediaId}></Media>
                      </div>
                    ) : (
                      <Tab.Group
                        as="div"
                        className="flex flex-col-reverse p-10 m-10"
                      >
                        {/* Image selector */}
                        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                          <Tab.List className="grid grid-cols-5 gap-6">
                            {detail.Media.map((media) => (
                              <Tab
                                key={media.mediaId}
                                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                              >
                                {({ selected }) => (
                                  <>
                                    <span className="sr-only">
                                      {" "}
                                      {media.name}{" "}
                                    </span>
                                    <span className="absolute inset-0 overflow-hidden rounded-md">
                                      <Media
                                        key={media.mediaId}
                                        media={media.mediaId}
                                      ></Media>
                                    </span>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "ring-indigo-500"
                                          : "ring-transparent",
                                        "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </Tab>
                            ))}
                          </Tab.List>
                        </div>

                        <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                          {detail.Media.map((media) => (
                            <Tab.Panel key={media.mediaId}>
                              <Media
                                key={media.mediaId}
                                media={media.mediaId}
                              ></Media>
                            </Tab.Panel>
                          ))}
                        </Tab.Panels>
                      </Tab.Group>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.TechnicalDetails && product.TechnicalDetails.length != 0 && (
          <section
            aria-labelledby="policy-heading"
            className="mt-16 lg:mt-24 p-5 m-5"
          >
            <div>
              <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
                Technical Details
              </h2>
            </div>
            {/* <div className="mx-auto p-5 m-10 max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8"> */}
            <div>
              {/* <div> */}
              {/* <div className="mx-auto max-w-2xl px-4 py-2"> */}
              <div className="min-w-full">
                <table className="border-solid border-2 border-black-500 w-full">
                  <tr className="border-solid border-2 border-black-500">
                    <th>Detail</th>
                    <th>Value</th>
                  </tr>
                  {product.TechnicalDetails.map((detail) => (
                    <tr
                      key={detail.productTechnicalDetailId}
                      className="border-solid border-2 border-black-500"
                    >
                      <td className="border-solid border-2 border-black-500">
                        {detail.key}
                      </td>
                      <td className="border-solid border-2 border-black-500">
                        {detail.value}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="reviews-heading" className="">
          <div className="mx-auto max-w-2xl py-24 px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:py-32 lg:px-8">
            <div className="lg:col-span-4">
              <h2
                id="reviews-heading"
                className="text-2xl font-bold tracking-tight text-gray-900"
              >
                Customer Reviews
              </h2>

              <div className="mt-3 flex items-center">
                <div>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          overallReview.rating > rating
                            ? "text-yellow-400"
                            : "text-gray-300",
                          "flex-shrink-0 h-5 w-5"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">
                    {overallReview.rating} out of 5 stars
                  </p>
                </div>
                <p className="ml-2 text-sm text-gray-900">
                  Based on {overallReview.reviewsCount} reviews
                </p>
              </div>

              {reviewId === "noreview" ? (
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    Share your thoughts
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    If you’ve used this product, share your thoughts with other
                    customers
                  </p>

                  <form method="post">
                    <div className="mt-6">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Rating
                      </label>
                      <div className="mt-1 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={classNames(
                              rating < reviewRating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "relative flex-shrink-0 h-5 w-5 cursor-pointer focus:outline-none"
                            )}
                            onClick={() => setReviewRating(rating + 1)}
                          >
                            <span className="absolute inset-0 flex items-center justify-center">
                              <StarIcon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="reviewContent"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Write about your experience
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="reviewContent"
                          name="reviewContent"
                          rows={4}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue={""}
                          onChange={(e) => setReviewContent(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => writeProductReview()}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              ) : reviewId !== "" ? (
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    Update your thoughts
                  </h3>
                  <form method="post">
                    <div className="mt-6">
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Rating
                      </label>
                      <div className="mt-1 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className={classNames(
                              rating < reviewRating
                                ? "text-yellow-400"
                                : "text-gray-300",
                              "relative flex-shrink-0 h-5 w-5 cursor-pointer focus:outline-none"
                            )}
                            onClick={() => setReviewRating(rating + 1)}
                          >
                            <span className="absolute inset-0 flex items-center justify-center">
                              <StarIcon
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label
                        htmlFor="reviewContent"
                        className="block text-sm font-medium text-gray-900"
                      >
                        Write about your experience
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="reviewContent"
                          name="reviewContent"
                          rows={4}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          defaultValue={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => deleteProductReview()}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProductReview()}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {reviews && reviews.length !== 0 && (
              <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                <h3 className="text-3xl">Recent reviews</h3>

                <div className="flow-root">
                  <div className="-my-12 divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <div key={review.id} className="py-12">
                        <div className="flex items-center">
                          {/* <img
                          src={review.avatarSrc}
                          alt={`${review.author}.`}
                          className="h-12 w-12 rounded-full"
                        /> */}
                          <div className="ml-4">
                            {/* <h4 className="text-sm font-bold text-gray-900">
                            {review.author}
                          </h4> */}
                            <div className="mt-1 flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    review.overallRating > rating
                                      ? "text-yellow-400"
                                      : "text-gray-300",
                                    "h-5 w-5 flex-shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="sr-only">
                              {review.overallRating} out of 5 stars
                            </p>
                          </div>
                        </div>

                        <div
                          className="mt-4 space-y-6 text-base italic text-gray-600"
                          // dangerouslySetInnerHTML={{ __html: review.content }}
                        />
                        {review.content}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer></Footer>
    </div>
  );
}
