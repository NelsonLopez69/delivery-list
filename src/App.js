import React, { useState, useEffect } from 'react';
import './App.css';
import HeaderContent from "./components/HeaderContent";
import DataTableLoader from "./components/DataTableLoader";
import LoaderHandler from "./components/LoaderHandler";
import axios from "axios";
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css'

let BACKEND_IP="192.168.0.109"

const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjI4MDA2MTU5LCJleHAiOjE2MzA1OTgxNTl9.LOHf9jPyvudVeqRLvSZzDcXj58Yd4WQQGKSuW0Lc7Aw',
};

const columns = [{  
  Header: 'Cliente',  
  accessor: 'name',
  width: 260,
  style: { 'whiteSpace': 'unset' } //Add this line to the column definition

  
 },{  
 Header: 'Pedido',  
 accessor: 'products' , 
 style: { 'whiteSpace': 'pre' } //Add this line to the column definition

 },{  
Header: 'Observaciones',  
accessor: 'note'  ,
style: { 'whiteSpace': 'unset' } //Add this line to the column definition

}]   

let ordeerProducts = [];
let dataOrders = []

const columsns = [{  
 Header: 'Name',  
 accessor: 'name'  
 },{  
 Header: 'Age',  
 accessor: 'age'  
 }]  

 var items = Array("#A9CCE3", "#F9E79F", "#D7BDE2", "#F5B7B1", "#E5E7E9",  "#A3E4D7", "#EDBB99", "#A9DFBF");

const renderOrders = (orders) => (
  <>
      <div className="card ">
          <div className="card-header">
              <h3 className="card-title">Lista de Pedidos</h3>
          </div>
          {/* /.card-header */}
          <div className="card-body table-responsive p-0">
          <table className="table table-hover text-nowrap">
              <thead>
                  <tr>
                      <th>{Object.keys(orders.orders)}</th>
                      <th>Pedido</th>
                      <th>Observaciones</th>
                      <th></th>
                  </tr>
              </thead>
              <tbody>

              </tbody>
          </table>
          </div>
          {/* /.card-body */}
      </div>

  </>
);



function formatProducts(products){
  let result = ""

    products.map((prod) =>{
      result+= ""+prod.OrderProduct.quantity+" "+prod.name+" \n"

})
  

  return result
}

function formatData () {

  console.log("kengt ", ordeerProducts.length)

  let ans =[]

  while(ans>0) ans.pop()

  while(ordeerProducts>0) ordeerProducts.pop()

  ordeerProducts.map((ord) => (
    ans.push({name: ord.name, products: formatProducts(ord.products), note: ord.note})
  ))
  


  //ans.push({name: "Julis",products: "1 trucha", note: "bien frita" })
  console.log("kengt2 ", ans.length)
  return ans

}




function App() {
  const [ data, setData ] = useState([]);

  const [loading, setLoading] = useState(false);


  const [ listening, setListening ] = useState(false);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

 var index = -1;


  useEffect( () => {  
    console.log('http://'+BACKEND_IP+':5000/events')

    if (!listening) {
      const events = new EventSource('http://'+BACKEND_IP+':5000/events');
      events.onmessage = (event) => {
        sleep(1000).then(() => {
         
        setData([])

        console.log("before.5", ordeerProducts.length)

        ordeerProducts = []

        axios.get("http://"+BACKEND_IP+":5000/api/orders", { headers })
        .then(response => {    

          console.log("innn", ordeerProducts.length)

                  response.data.orders.filter(ord => !ord.isPaid).map((ordr) => {
                   ordeerProducts.push(ordr)
                   } )
      
                   setData(formatData())

        }) })
      };


      setListening(true);
    }
  }, [data]);

  return (
    <div>  
    <ReactTable  
        data={data}  
        columns={columns}  
        style={{overflow:'wrap',
                overflowWrap: 'break-word',
                fontSize: 40}}
        getTrProps ={ (state, rowInfo, instance) => {
          index+=1;

          if(index == 7) index=-1
            return {
              style: {
                background: items[index]}
            }

          return {};
        }
      }
    />  
    </div>    
  );
}

export default App;