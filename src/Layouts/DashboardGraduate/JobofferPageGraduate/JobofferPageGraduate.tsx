import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosinstance from "@/Context/BaseUrl/AxiosInstance";

type Offer = {
  _id: string;
  position?: string;
  message?: string;
  status?: string;
  company?: {
    companyName?: string;
  };
};

async function getOffers() {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt");

  const { data } = await axiosinstance.get("/api/v1/offers/my-offers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt");

  const { data } = await axiosinstance.patch(
    `/api/v1/offers/${id}/${action}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
}

export default function JobOffersPage() {
  const queryClient = useQueryClient();

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

  function handleAction(id: string, action: "accept" | "decline") {
    mutate({ id, action });
  }

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

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
                  {offer.company?.companyName?.[0] || "C"}
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    {offer.company?.companyName || "Unknown Company"}
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

                  <button className="rounded-lg border border-gray-300 px-6 py-2 font-medium transition hover:bg-gray-50">
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
    </div>
  );
}