export const integrations = {
  tripay: {
    provider: 'Tripay',
    // TODO: isi endpoint Laravel, merchant ref, dan channel pembayaran dari backend pedu-be.
    paymentPath: '/payments/tripay',
  },
  maps: {
    provider: 'Maps untuk absensi',
    // TODO: tentukan Google Maps atau provider lain, lalu simpan API key di env backend/frontend.
    attendancePath: '/attendance/location',
  },
};
