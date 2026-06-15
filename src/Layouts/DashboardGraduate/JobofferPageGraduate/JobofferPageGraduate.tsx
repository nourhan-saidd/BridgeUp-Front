import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";

type Company = {
  _id?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  location?: string;
  industry?: string;
  website?: string;
  description?: string;
};

type Offer = {
  _id: string;
  position?: string;
  message?: string;
  status?: string;
  company?: Company | string;
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt")
  );
}

async function getOffers() {
  const { data } = await axiosinstance.get("/api/v1/offers/my-offers", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return data;
}

async function updateOfferStatus({
  id,
  action,
}: {
  id: string;
  action: "accept" | "decline";
}) {
  const { data } = await axiosinstance.patch(
    `/api/v1/offers/${id}/${action}`,
    {},
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return data;
}

export default function JobOffersPage() {
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobOffers"],
    queryFn: getOffers,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const offers: Offer[] = data?.data || [];

  const { mutate, isPending } = useMutation({
    mutationFn: updateOfferStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobOffers"] });
    },
  });

  function getCompanyName(offer: Offer) {
    if (typeof offer.company === "object") {
      return offer.company?.companyName || "Unknown Company";
    }

    return "Unknown Company";
  }

  function getCompanyData(offer: Offer): Company | null {
    if (typeof offer.company === "object") {
      return offer.company;
    }

    return null;
  }

  function handleAction(id: string, action: "accept" | "decline") {
    mutate({ id, action });
  }

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error Loading Offers
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-2xl font-bold">Job Offers</h1>

      <div className="mb-6 flex items-center rounded-lg border border-blue-100 bg-blue-50 p-4">
        <span className="mr-2 font-bold text-blue-700">
          You have {offers.length} job offers!
        </span>
        <span className="text-gray-600">
          Review the offers and respond to companies
        </span>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            No offers found
          </div>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-600">
                  {getCompanyName(offer)[0] || "C"}
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {getCompanyName(offer)}
                  </h2>

                  <p className="font-medium text-blue-600">
                    {offer.position || "No position"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {offer.message || "No message"}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Status: {offer.status || "unknown"}
                  </p>
                </div>
              </div>

              {offer.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    disabled={isPending}
                    onClick={() => handleAction(offer._id, "accept")}
                    className="rounded-lg bg-indigo-700 px-6 py-2 font-medium text-white transition hover:bg-indigo-800 disabled:opacity-50"
                  >
                    Accept & Schedule Interview
                  </button>

                  <button
                    onClick={() => setSelectedOffer(offer)}
                    className="rounded-lg border border-gray-300 px-6 py-2 font-medium transition hover:bg-gray-50"
                  >
                    View Details
                  </button>

                  <button
                    disabled={isPending}
                    onClick={() => handleAction(offer._id, "decline")}
                    className="font-medium text-gray-600 transition hover:text-red-600 disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Offer Details
              </h2>

              <button
                onClick={() => setSelectedOffer(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <Detail label="Company" value={getCompanyName(selectedOffer)} />
              <Detail label="Position" value={selectedOffer.position} />
              <Detail label="Message" value={selectedOffer.message} />
              <Detail label="Status" value={selectedOffer.status} />

              <Detail
                label="Email"
                value={getCompanyData(selectedOffer)?.email || "Not available"}
              />

              <Detail
                label="Phone"
                value={getCompanyData(selectedOffer)?.phone || "Not available"}
              />

              <Detail
                label="Location"
                value={
                  getCompanyData(selectedOffer)?.location || "Not available"
                }
              />

              <Detail
                label="Industry"
                value={
                  getCompanyData(selectedOffer)?.industry || "Not available"
                }
              />
            </div>

            <button
              onClick={() => setSelectedOffer(null)}
              className="mt-6 w-full rounded-xl bg-indigo-700 px-5 py-2 font-medium text-white hover:bg-indigo-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 text-gray-700">{value || "-"}</p>
    </div>
  );
}