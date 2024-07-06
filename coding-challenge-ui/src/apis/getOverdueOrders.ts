const getOverdueOrders = async (
  order: string,
  pageSize: number,
  skip: number,
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/orders/overdueOrders?order=${order}&pageSize=${pageSize}&skip=${skip}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default getOverdueOrders;
