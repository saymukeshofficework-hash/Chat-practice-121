/** AG-3 full-length mock tests (engine: public/mock-tests/ag3/test.html).
 *  Test 1 is free and public (public/mock-tests/ag3/tests/01.json).
 *  Tests 2–20 are paid (₹199 test series): files live in private Supabase bucket "tests" at ag3/NN.json
 *  and are served by the notes-checkout function only for a paid "ag3-tests" token. */
export const AG3_MOCK = {
  total: 20,
  /** Free tests whose public JSON is published. */
  free: [1] as number[],
  product: "ag3-tests",
  price: 199,
  enginePath: "/mock-tests/ag3/test.html",
};
