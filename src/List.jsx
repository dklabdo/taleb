import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AppContext } from "./AppProvider";

const apiLink = import.meta.env.VITE_API_LINK;

function List() {
  const [search, setsearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["list"],
    queryFn: async () => {
      console.log(apiLink);
      const res = await axios.get(`${apiLink}/bureau`);
      console.log(res.data);
      return res.data;
    },
  });

  const exportMutation = useMutation({
    mutationKey: ["export"],
    mutationFn: async () => {
      console.log(`${apiLink}/bureau/excel/v2`);

      const res = await axios({
        method: "GET",
        url: `${apiLink}/bureau/excel/v2`,
        responseType: "blob",
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bureau.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    },
  });

  function handleExport() {
    exportMutation.mutate();
  }

  function check(name, code) {
    
    if (name.includes(search) || code.includes(search)) {
      return true;
    } else return false;
  }

  return (
    <div className="w-full h-screen flex p-2 flex-col gap-3 ">
      <div className="w-full flex items-center justify-between px-2 ">
        <h2 className="text-xl text-blue-900"> List </h2>
        <div className="flex gap-2 ">
          <button
            onClick={() => handleExport()}
            to="/add"
            className="p-2 text-white bg-blue-900  rounded-md "
          >
            {" "}
            Exporter{" "}
          </button>
          <Link to="/add" className="p-2 text-white bg-blue-900  rounded-md ">
            {" "}
            Ajouter{" "}
          </Link>
        </div>
      </div>
      <div className="w-full flex gap-3 p-3">
        <input
          onChange={(e) => setsearch(e.target.value)}
          type="text"
          value={search}
          placeholder="recherche"
          className="w-full"
        />
        <button className="p-3 bg-blue-900 text-white rounded-md" onClick={() => setsearch("")} >Reset</button>
      </div>
      <div
        className="w-full  h-full justify-end px-4 overflow-y-scroll pt-4 "
      >
        {isLoading ? (
          <div className="loader mx-auto my-24"></div>
        ) : isError ? (
          <p> Erreur </p>
        ) : (
          data.map((info, index) => {
            return (
              check(info.nomBureau , info._id) && (
                <StudentList
                  key={index}
                  code={info._id}
                  numeroBureau={info.NumeroBureau}
                  bureau={info.nomBureau}
                />
              )
            );
          })
        )}
      </div>
    </div>
  );
}

function StudentList({ bureau, numeroBureau, code }) {
  const navigate = useNavigate();
  const queries = useQueryClient();
  const { setisModifie, setmodifieObj } = useContext(AppContext);

  function handleModifie() {
    setisModifie(true);
    setmodifieObj({
      nomBureau: bureau,
      NumeroBureau: numeroBureau,
      id: code,
    });
    navigate("/add");
  }

  function handleDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteMutation.mutate();
      }
    });
  }

  const DeleteMutation = useMutation({
    mutationKey: ["delete"],
    mutationFn: async () => {
      const res = await axios.delete(`${apiLink}/bureau/${code}`);
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      queries.invalidateQueries(["list"]);
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    },
  });

  function copy(){
    navigator.clipboard.writeText(code)
  }
  return (
    <div className="px-4 rounded-md text-blue-900 even:bg-gray-100  flex flex-col md:flex-row  justify-between  w-full py-6 gap-4">
      <p className="font-medium text-lg"> {bureau} </p>
      <p> {numeroBureau} </p>
      <p> {code} </p>
      <div className="flex gap-6 items-center">
        <button onClick={() => copy()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <button onClick={() => handleModifie()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button onClick={() => handleDelete()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default List;
