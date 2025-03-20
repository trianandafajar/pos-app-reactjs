import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { saveOrder } from "../features/CartSlice.js";
import Swal from "sweetalert2";

const TotalCart = ({ carts }) => {
  const dispatch = useDispatch();

  // Calculate total price of all items in the cart
  let sum = 0;
  if (carts && carts.length > 0) {
    sum = carts.reduce((result, item) => result + (parseInt(item.totalPrice) || 0), 0);
  }

  // Function to handle saving the cart data and dispatching the order
  const saveCartData = (data) => {
    if (data.length === 0) {
      Swal.fire("Your cart is empty", "Please add items to your cart before proceeding.", "warning");
      return;
    }

    const orderData = {
      date: new Date(),
      total: sum,
      detail: data,
    };
    
    dispatch(saveOrder(orderData));
    Swal.fire({
      title: "Order Success!",
      text: `Your total is Rp ${sum.toLocaleString("id-ID")}`,
      icon: "success",
    });
  };

  return (
    <div className="fixed-bottom">
      <Row>
        <Col md={{ span: 3, offset: 9 }} className="bg-body pt-2">
          <div className="px-3">
            <h4>
              Total Bayar:{" "}
              <strong className="float-end me-3">
                Rp {sum.toLocaleString("id-ID")}
              </strong>
            </h4>
            <Button
              variant="primary"
              className="w-100 me-3 mb-3"
              size="lg"
              disabled={carts && carts.length === 0} // Disable button if cart is empty
              onClick={() => saveCartData(carts)}
            >
              <FaCartArrowDown /> Bayar
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

TotalCart.propTypes = {
  carts: PropTypes.array.isRequired, // Ensure carts is always an array
};

export default TotalCart;
