// Mock for the Redux store
module.exports = {
  useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
  useAppSelector: jest.fn().mockReturnValue({
    userLocation: null,
    locationPermissionGranted: false,
  }),
};
