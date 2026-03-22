const expenses_table_header = "<tr><th class=\"exp\">Expense</th><th class=\"cst\">Cost</th><th class=\"esc\">🗑️</th></tr>"
const rupee_symbol = '₹';
const dollar_symbol = "$";

var currecy = rupee_symbol;
var salary = 0;
var expense_names = [];
var expense_costs = [];
var expense_total = 0.0;
var expense_balance = 0.0;
var draw_permission = true;

var pdf_maker;
var pie_chart;
function drawChart(exp_name,exp_cost){
    console.log("chart drawn");

    pie_chart = document.getElementById("pie-chart");
    new Chart(pie_chart, {
    type: 'pie',
    data: {
      labels: exp_name,
      datasets: [{
        label: 'Cost in '+currecy,
        data: exp_cost,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    
  });
}
    

function documentLoaded(){
    console.log("Document loaded!");
    loadData();
    calc_balance();
    drawExpensesTable();
    drawChart(expense_names,expense_costs);
}

function saveData(){
    localStorage.clear();
    localStorage.setItem("salary",salary);
    localStorage.setItem("expense_names", expense_names);
    localStorage.setItem("expense_costs", expense_costs);
}

function loadData(){

    salary = 0.0;
    salary = parseFloat(localStorage.getItem("salary"));
    document.getElementById("salary-input-field").value  = salary;

    expense_names = [];
    expense_costs = [];
    
    var names = localStorage.getItem("expense_names").split(",");
    var costs = localStorage.getItem("expense_costs").split(",");

    console.log(names);
    console.log(costs);

    if (names != [] && costs!= []){
        expense_names = names;
        for(var i=0;i<costs.length;i++){
            expense_costs.push( parseFloat( costs[i] ) );
        }
    }
    
}

function salary_changed(){
}

function submitButtonClicked(){
    console.log("Button pressed");

    salary = parseFloat(document.getElementById("salary-input-field").value);

    if ( Number.isInteger(salary)){
        draw_permission = true;
        set_expenses();/*Might change draw_permission */
        if (draw_permission){
            drawExpensesTable();
        }
    }
    else{
        window.alert("Bad Salary Input \n1.Salary MUST NOT be empty\n2.Salary MUST be a number greater than 0")
    }
    saveData();
    
}

function calc_balance()
{
    expense_total = 0.0;
        for(var i = 0;i < expense_costs.length;i++)
        {
            expense_total += expense_costs[i];
        }
        expense_balance = salary - expense_total;
}

function set_expenses(){

    var current_expenseName = document.getElementById("expenseName-input-field").value
    var current_expenseCost = document.getElementById("expenseCost-input-field").value

    if ( current_expenseCost != "" && current_expenseName != "" && parseFloat(current_expenseCost)>0.0)
    {
        expense_costs.push( parseFloat( current_expenseCost ));
        expense_names.push(current_expenseName);
        calc_balance();
    }
    else
    {
        window.alert("Bad Expense Input \n1.Name And Cost MUST be provided\n2.Cost MUST be a number\n3.Cost cannot be in the negetive")
        draw_permission = false;
    }
}

function delete_expense(index){

    expense_names.splice(index,1);
    expense_costs.splice(index,1);
    saveData();
    calc_balance();
    drawExpensesTable();
    drawChart(expense_names,expense_costs);

}

const garbage_ico = "🗑️";
function drawExpensesTable(){
    document.getElementById("expenses-table").innerHTML = expenses_table_header;

    for(var i=0;i<expense_names.length;i++)
    {
        if (true)
        {
            document.getElementById("expenses-table").innerHTML+= "<tr><td>"+expense_names[i]+"</td><td>"+parseFloat(expense_costs[i])+"</td><td><a href=\"javascript:delete_expense("+String(i)+")\">"+garbage_ico+"</a></td></tr>";
        }
        else{
            console.log("Number is NaN");
        }
    }

    document.getElementById("total-salary").innerHTML = "Total Salary:"+currecy+String(salary);
    document.getElementById("total-expenses").innerHTML = "Total Expenses:"+currecy+String(expense_total);

    if (expense_balance < salary*0.1)
    {
        console.log("Salary low")
        var element = document.getElementById("balance");
        element.classList.add("low-balance");
        document.getElementById("balance").innerHTML = "Remaining Balance:"+currecy+String(expense_balance);
        window.alert("WARNING : Balance too low (below 10% of salary)")
    }
    else
    {   
        console.log("salary fine")
        var element = document.getElementById("balance");
        element.classList.remove("low-balance");
        document.getElementById("balance").innerHTML = "Remaining Balance:"+currecy+String(expense_balance);
    }
    
}

const dollar_rate = 93.6;

function change_to_currency()
{
    if (currecy == rupee_symbol){
        console.log("Changing to dollar");
        change_to_dollar();
    }
    else{
        console.log("Changing to rupee");
        change_to_rupee();
    }
    document.getElementById("salary-input-field").value  = salary;
}

function change_to_dollar(){
    currecy = dollar_symbol;
    salary /= dollar_rate;
    salary = Math.round(salary);
    for(var i=0;i<expense_costs.length;i++)
    {
        expense_costs[i] /= dollar_rate;
        expense_costs[i] = Math.round( expense_costs[i] );
    }
    saveData();
    calc_balance();
    drawExpensesTable();

}

function change_to_rupee(){
    currecy = rupee_symbol;
    salary *= dollar_rate;
    salary = Math.round(salary);

    for(var i=0;i<expense_costs.length;i++)
    {
        expense_costs[i] *= dollar_rate;
        expense_costs[i] = Math.round( expense_costs[i] );
    }
    saveData();
    calc_balance();
    drawExpensesTable();

}

const jsPDF = window.jsPDF;
function export_pdf(){
    const doc = jsPDF;
    doc.text("Hello world!", 10, 10); 
    doc.save("sample.pdf");
}