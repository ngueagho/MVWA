import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function UserManage() {
  const user = useSession();
  const [status, setStatus] = useState(1);
  const [reload, setReload] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [addresses, setAddresses] = useState<any | null>(null);
  const [notificationProfile, setNotificationProfile] = useState<any | null>(
    null
  );
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [line1, setLine1] = useState("");

  const tprcUpdateProfile = trpc.useMutation([
    "user.profile.self.updateProfile",
  ]);

  const tprcUpdateAddress = trpc.useMutation(["user.address.updateAddress"]);
  const trpcAddAddress = trpc.useMutation(["user.address.addAddress"]);
  function updateProfile() {
    tprcUpdateProfile.mutate(
      {
        name: name,
        bio: about,
      },

      {
        onSuccess: (data) => {
          alert("Sucessfully upadated profile");
        },
        onError: (error) => {
          alert("Something went wrong");
          console.log(error);
        },
      }
    );
  }

  function updateAddress() {
    if (addresses && addresses.length > 0) {
      tprcUpdateAddress.mutate(
        {
          addressId: addresses[0].userAddressId,
          line1: line1,
          city: city,
          state: state,
          country: getCountryCode(country),
          zipcode: zipcode,
          addressType: "REGULAR",
        },
        {
          onSuccess: (data) => {
            alert("Sucessfully upadated address");
          },
          onError: (error) => {
            alert("Something went wrong");
            console.log(error);
          },
        }
      );
    } else {
      trpcAddAddress.mutate(
        {
          line1: line1,
          city: city,
          state: state,
          country: getCountryCode(country),
          zipcode: zipcode,
          addressType: "REGULAR",
        },
        {
          onSuccess: (data) => {
            alert("Sucessfully upadated address");
          },
          onError: (error) => {
            alert("Something went wrong");
            console.log(error);
          },
        }
      );
    }
  }

  trpc.useQuery(
    ["user.profile.getUserProfile", { userId: user.data?.user?.id }],
    {
      enabled: !!user.data?.user?.id,
      onSuccess: (data) => {
        setProfile(data);
        setName(data?.name);
        setAbout(data?.bio ?? "");
        setStatus(status + 1);
        setReload(!reload);
      },
      onError: (error) => {
        setStatus(-10);
        console.log(error);
      },
    }
  );

  trpc.useQuery(["user.address.getUserAddresses"], {
    enabled: !!user.data?.user?.id,
    onSuccess: (data) => {
      console.log(data);
      setAddresses(data);
      setLine1(data[0]?.line1 ?? "");
      setCity(data[0]?.City.name ?? "");
      setState(data[0]?.City.State.identifier ?? "");
      setCountry(getCountry(data[0]?.City.State.Country.code ?? ""));
      setZipcode(data[0]?.zipcode ?? "");
      setStatus(status + 1);
      setReload(!reload);
    },
    onError: (error) => {
      setStatus(-10);
      console.log(error);
    },
  });

  trpc.useQuery(["user.notification.getNotificationProfile", {}], {
    enabled: !!user.data?.user?.id,
    onSuccess: (data) => {
      console.log(data);
      setNotificationProfile(data);
      setStatus(status + 1);
      setReload(!reload);
    },
    onError: (error) => {
      setStatus(-10);
      console.log(error);
    },
  });

  function getCountry(code: string) {
    if (code === "IN") return "India";
    else return "Other";
  }

  function getCountryCode(name: string) {
    if (name === "India") return "IN";
    else return "OTHER";
  }

  if (status > 0 && status < 3) return <div>Loading</div>;
  return (
    <div className="flex flex-col min-h-screen justify-around overflow-hidden">
      <Navbar></Navbar>
      <div className="lg:grid lg:grid-cols-9 lg:gap-x-5 lg:p-5 lg:m-10">
        <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
          <form>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        defaultValue={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="username"
                        className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="About you"
                        defaultValue={about}
                        onChange={(e) => setAbout(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => updateProfile()}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

          <form>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Personal Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use a permanent address where you can recieve mail.
                  </p>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      type="text"
                      disabled
                      name="email-address"
                      id="email-address"
                      defaultValue={user.data?.user.email}
                      autoComplete="email"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      disabled
                      name="phone-number"
                      id="phone-number"
                      autoComplete="phone"
                      // value={}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      defaultValue={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value={"India"}>India</option>
                      <option value={"US"}>United States</option>
                      <option value={"CA"}>Canada</option>
                      <option value={"UK"}>UK</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="street-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <input
                      type="text"
                      name="street-address"
                      id="street-address"
                      autoComplete="street-address"
                      defaultValue={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      defaultValue={city}
                      onChange={(e) => setCity(e.target.value)}
                      autoComplete="address-level2"
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      defaultValue={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      name="postal-code"
                      id="postal-code"
                      autoComplete="postal-code"
                      defaultValue={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  onClick={() => updateAddress()}
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

          {/* <form>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white py-6 px-4 sm:p-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Notifications
                  </h3>
                </div>

                <fieldset>
                  <legend className="text-base font-medium text-gray-900">
                    By Email
                  </legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="deals"
                          name="deals"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="deals"
                          className="font-medium text-gray-700"
                        >
                          Deals
                        </label>
                        <p className="text-gray-500">
                          Get notified for deals and offers.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="stock"
                            name="stock"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="stock"
                            className="font-medium text-gray-700"
                          >
                            Stock
                          </label>
                          <p className="text-gray-500">
                            Get notified when a product is back in stock.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="priceDrop"
                            name="priceDrop"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="priceDrop"
                            className="font-medium text-gray-700"
                          >
                            Price Drop
                          </label>
                          <p className="text-gray-500">
                            Get notified when a product's price drops.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <fieldset className="mt-6">
                  <legend className="text-base font-medium text-gray-900">
                    By SMS
                  </legend>
                  <p className="text-sm text-gray-500">
                    These are delivered via SMS to your mobile phone.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="dealsSMS"
                          name="dealsSMS"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="dealsSMS"
                          className="font-medium text-gray-700"
                        >
                          Deals
                        </label>
                        <p className="text-gray-500">
                          Get notified for deals and offers.
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="stockSMS"
                            name="stockSMS"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="stockSMS"
                            className="font-medium text-gray-700"
                          >
                            Stock
                          </label>
                          <p className="text-gray-500">
                            Get notified when a product is back in stock.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input
                            id="priceDropSMS"
                            name="priceDropSMS"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="priceDropSMS"
                            className="font-medium text-gray-700"
                          >
                            Price Drop
                          </label>
                          <p className="text-gray-500">
                            Get notified when a product's price drops.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => updateNotification()}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form> */}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
