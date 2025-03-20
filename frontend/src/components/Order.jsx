import React, { useEffect } from "react";
import { Col, ListGroup, Spinner } from "react-bootstrap"; // Add Spinner for better UX
import { useDispatch, useSelector } from "react-redux";
import { getCart, setDetail } from "../features/CartSlice.js";
import TotalCart from "./TotalCart.jsx";
import CartModal from "./CartModal.jsx";

const Order = () => {
  const carts = useSelector((state) => state.cart.data);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleItemClick = (item) => {
    dispatch(setDetail(item));
    setModalShow(true);
  };

  return (
    <>
      <Col md={3} className="mb-5 pb-5">
        <h4>Order List</h4>
        {/* Render error message if exists */}
        {error && <div className="alert alert-danger">{error}</div>}

        <hr />
        <ListGroup variant="flush">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : carts && carts.length > 0 ? (
            carts.map((item) => (
              <ListGroup.Item
                key={item.id}
                variant="flush"
                style={{ cursor: "pointer" }}
                onClick={() => handleItemClick(item)}
              >
                <div className="fw-bold">{item.name}</div>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-auto">
                    <small>
                      Rp {parseInt(item.price).toLocaleString("id-ID")} x{" "}
                      {item.qty}
                    </small>
                    <p>
                      <small>{item.note}</small>
                    </p>
                  </div>
                  <div>
                    <strong>
                      <small>
                        Rp{" "}
                        {parseInt(item.price * item.qty).toLocaleString(
                          "id-ID"
                        )}
                      </small>
                    </strong>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p>Your cart is empty</p> // Clear message when cart is empty
          )}
        </ListGroup>

        <TotalCart carts={carts} />
      </Col>

      {/* Modal for displaying item details */}
      <CartModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default Order;
