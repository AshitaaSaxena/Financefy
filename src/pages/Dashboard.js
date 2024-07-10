import React, { useEffect, useState } from 'react'
import Header from '../Components/Header/Header'
import Cards from '../Components/Cards'
import AddExpenseModal from '../Components/Modals/addExpense';
import AddIncomeModal from '../Components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import moment from "moment";
import TransactionsTable from '../Components/TransactionsTable';
import ChartComponent from '../Components/Charts';
import NoTransactions from '../Components/NoTransactions';

function Dashboard() {
  /*const transactions = [
    { type:"income",
      amount:1200,
      tag: "salary",
      name: "income 1",
      date:  "2024-06-05",
    },
    { type:"expense",
      amount:800,
      tag: "food",
      name: "expense 1",
      date:  "2024-06-10",
    },
 ];*/
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };
   
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
        if (!many) toast.success("Transaction Added!");
        let newArray = transactions;
        newArray.push(transaction);
        setTransactions(newArray);
        calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }
  useEffect(() => {
    //Get all Docs from Collection
    fetchTransactions();
  }, [user]);
  
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };


  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array", transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }
  
  let sortedTransactions= transactions.sort((a, b) => {
   return new Date(a.date) - new Date(b.date);
    }
  )
  return (
    <div>
      <Header />
       {loading ? (
        <p>Loading...</p>
       ) : (
        <>
      <Cards
        income ={income}
        expense ={expense}
        totalBalance ={totalBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />
      {transactions && transactions.length!=0? 
      <ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions />}
      
        <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable 
          transactions={transactions} 
          addTransaction = {addTransaction}  
          fetchTransactions={fetchTransactions}/>
          </>
          )}
    </div>
  )
}

export default Dashboard