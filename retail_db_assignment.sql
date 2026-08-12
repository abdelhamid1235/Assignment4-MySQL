SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


-- Table structure for table `products`
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `P_supplier_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `products` (`product_id`, `product_name`, `price`, `stock_quantity`, `P_supplier_id`) VALUES
(1, 'Milk', 15.00, 50, 1),
(2, 'Bread', 25.00, 30, 1);

-- --------------------------------------------------------

-- Table structure for table `sales`
CREATE TABLE `sales` (
  `sales_id` int(11) NOT NULL,
  `quantity_sold` int(11) NOT NULL,
  `sale_date` date NOT NULL,
  `s_product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sales` (`sales_id`, `quantity_sold`, `sale_date`, `s_product_id`) VALUES
(1, 2, '2025-05-20', 1),
(2, 2, '2025-05-20', 1);

-- --------------------------------------------------------

-- Table structure for table `suppliers`
CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `supplier_name` varchar(100) NOT NULL,
  `contact_number` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `suppliers` (`supplier_id`, `supplier_name`, `contact_number`) VALUES
(1, 'FreshFoods', '01001234567');

-- Indexes for table `products`

ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `FK_P_SUP` (`P_supplier_id`);

-- Indexes for table `sales`
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sales_id`),
  ADD KEY `FK_P_Sales` (`s_product_id`);

-- Indexes for table `suppliers`
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

-- AUTO_INCREMENT for table `products`
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

-- AUTO_INCREMENT for table `sales`

ALTER TABLE `sales`
  MODIFY `sales_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

-- AUTO_INCREMENT for table `suppliers`
ALTER TABLE `suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


-- Constraints for table `products`
ALTER TABLE `products`
  ADD CONSTRAINT `FK_P_SUP` FOREIGN KEY (`P_supplier_id`) REFERENCES `suppliers` (`supplier_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Constraints for table `sales`
ALTER TABLE `sales`
  ADD CONSTRAINT `FK_P_Sales` FOREIGN KEY (`s_product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;