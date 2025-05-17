import { GetServerSideProps } from 'next';
import clsx from 'clsx';
import "@/app/globals.css"


type Order = {
  id: string;
  nama: string;
  layanan: string;
  total: number;
  status: string;
  created_at: string;
  weight: number | null;
};

type OrderPageProps = {
  order: Order | null;
};

export default function OrderDetailPage({ order }: OrderPageProps) {
  if (!order) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        ❌ Order tidak ditemukan.
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'Belum Bayar - Diproses': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'Sudah Bayar - Diproses': 'bg-blue-100 text-blue-800 border border-blue-300',
    'Sudah Bayar - Selesai': 'bg-green-100 text-green-800 border border-green-300',
    'Belum Bayar - Selesai': 'bg-red-100 text-red-800 border border-red-300',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          📋 Detail Order
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <tbody className="text-gray-700 text-base">
              <TableRow label="ID" value={order.id} />
              <TableRow label="Nama" value={order.nama} />
              <TableRow label="Layanan" value={order.layanan} />
              <TableRow
                label="Total"
                value={`Rp${order.total.toLocaleString('id-ID')}`}
              />
              <TableRow
                label="Status"
                value={
                  <span
                    className={clsx(
                      'inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-sm',
                      statusColors[order.status] || 'bg-gray-100 text-gray-700 border border-gray-300'
                    )}
                  >
                    {order.status}
                  </span>
                }
              />
              <TableRow
                label="Tanggal"
                value={new Date(order.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
              <TableRow
                label="Berat (kg)"
                value={order.weight ? `${order.weight} kg` : '-'}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-200">
      <td className="font-medium text-gray-600 py-3 pr-4 w-1/3">{label}</td>
      <td className="py-3">{value}</td>
    </tr>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let id = context.params?.id as string;

  // Normalisasi jika user input /order/005 → jadi ord005
  if (/^\d+$/.test(id)) {
    id = `ord${id.padStart(3, '0')}`;
  }

  const res = await fetch(`https://backend-t7ci.onrender.com/order/${id}`);

  if (!res.ok) {
    return { props: { order: null } };
  }

  const order = await res.json();

  return {
    props: {
      order,
    },
  };
};
