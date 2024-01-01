package com.techbeyond.calibraapi;

public class tset {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5, 6, 7, 8, 9};

        System.out.println(getMatrixDiagonalSum(arr));
    }

    public static Integer getMatrixDiagonalSum(int[] input) {
        // check if the input array can represent a square matrix
        int n = (int) Math.sqrt(input.length);
 
        if (n * n != input.length) {
            // return null or throw an exception
            return null;
            // or
            // throw new IllegalArgumentException("Input array cannot represent a square matrix");
        }
        // initialize the sum variable
        int sum = 0;
        // loop through the diagonal elements of the matrix
        for (int i = 0; i < n; i++) {
            // add the element at index i * (n + 1) to the sum
            sum += input[i * (n + 1)];
            System.out.println(sum);
        }
        // return the sum
        return sum;
    }
}
