import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

const ValidatorRegEx = new Map<string, RegExp>([
  [
    "email",
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  ],
  ["password", /^.{10,}$/],
  [
    // not working for all cases
    "date",
    /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)[0-9]{2}/,
  ],
]);

// validator
export const validator = (_type: string, data: string): boolean => {
  if (!ValidatorRegEx.has(_type))
    throw new Error(`Cant validate the type:${_type}`);

  return ValidatorRegEx.get(_type)!.test(data);
};

export default validator;

// Add support for different type of medias
export const Media = ({ media }: { media: string }) => {
  const [url, setURL] = useState("");
  const [altText, setAltText] = useState("");

  trpc.useQuery(["media.get", media], {
    onSuccess: (data) => {
      if (data && data.url) {
        if (!data.url.startsWith("/")) {
          setURL("/".concat(data.url));
        } else {
          setURL(data.url);
        }
        setAltText(data.altText);
      }
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  console.log(media);

  return (
    <img
      // height={"200px"}
      // width={"200px"}
      // style={"height:200px,width:200px"}
      src={`http://localhost:8080/fileRetrieve?token=${media}`}
      alt={altText}
      className="h-full w-full object-cover object-center"
    />
  );
};

export const getProductLink = (identifier: string) => {
  return `/product/${identifier}`;
};

export const getProductEditLink = (identifier: string) => {
  return `/seller/editproduct?id=${identifier}`;
};

export const getStoreEditLink = (identifier: string) => {
  return `/seller/editstore?id=${identifier}`;
};

export const getStoreLink = (identifier: string) => {
  return `/seller/store?storeId=${identifier}`;
};

export const getAddProductLink = (identifier: string) => {
  return `/seller/addproduct?id=${identifier}`;
};

export const getOpenStoreLink = () => {
  return `/seller/openstore`;
};

export const getOrderLink = (orderId: string) => {
  return `/user/order/${orderId}`;
};

// [text](link)
export function getProductDescription(desc: string) {
  if (!desc) return "";
  const elements: ReactElement[] = [];
  const caseSensitive = true;
  const searchStr1 = "[";
  const searchStr2 = "]";
  const searchStr3 = "(";
  const searchStr4 = ")";
  let startIndex = 0;
  if (!caseSensitive) {
    desc = desc.toLowerCase();
  }

  while (startIndex > -1) {
    const index1 = desc.indexOf(searchStr1, startIndex);
    const index2 = desc.indexOf(searchStr2, index1);
    const index3 = desc.indexOf(searchStr3, index2);
    const index4 = desc.indexOf(searchStr4, index3);
    if (index1 > -1 && index2 > -1 && index3 > -1 && index4 > -1) {
      elements.push(<span>{desc.substring(startIndex, index1)}</span>);
      elements.push(
        <a className="text-blue-500" href={desc.substring(index3 + 1, index4)}>
          {desc.substring(index1 + 1, index2)}
        </a>
      );
      startIndex = index4 + 1;
    } else {
      elements.push(<span>{desc.substring(startIndex, desc.length)}</span>);
      startIndex = -1;
    }
  }
  return elements;
}

export function getProductDescriptionSecure(desc: string) {
  if (!desc) return "";
  const elements: ReactElement[] = [];
  const caseSensitive = true;
  const searchStr1 = "[";
  const searchStr2 = "]";
  const searchStr3 = "(";
  const searchStr4 = ")";
  let startIndex = 0;
  if (!caseSensitive) {
    desc = desc.toLowerCase();
  }

  while (startIndex > -1) {
    const index1 = desc.indexOf(searchStr1, startIndex);
    const index2 = desc.indexOf(searchStr2, index1);
    const index3 = desc.indexOf(searchStr3, index2);
    const index4 = desc.indexOf(searchStr4, index3);
    if (index1 > -1 && index2 > -1 && index3 > -1 && index4 > -1) {
      elements.push(<span>{desc.substring(startIndex + 1, index1)}</span>);
      if (
        desc.substring(index3 + 1, index4).startsWith("http") ||
        desc.substring(index3 + 1, index4).startsWith("https")
      ) {
        elements.push(
          <a
            className="text-blue-500"
            href={desc.substring(index3 + 1, index4)}
          >
            {desc.substring(index1 + 1, index2)}
          </a>
        );
      }
      startIndex = index4 + 1;
    } else {
      elements.push(<span>{desc.substring(startIndex, desc.length)}</span>);
      startIndex = -1;
    }
  }
  return elements;
}
