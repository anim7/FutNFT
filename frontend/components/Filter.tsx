import { ethers } from "ethers";
import React from "react";
import filterStyles from "../styles/Filter.module.scss";

const { useState } = React;

interface Props {
  handleClick: (
    name: string,
    minLevel: number,
    maxLevel: number,
    minPrice: number,
    maxPrice: number
  ) => void;
  futNFTTraining: ethers.Contract;
  priceEnabled: boolean;
}

const Filter: React.FunctionComponent<Props> = ({
  handleClick,
  priceEnabled,
}) => {
  const [nameFilter, setNameFilter] = useState<boolean>(false);
  const [levelFilter, setLevelFilter] = useState<boolean>(false);
  const [priceFilter, setPriceFilter] = useState<boolean>(false);
  return (
    <>
      <button
        className={filterStyles.activate}
        onClick={() => {
          document.getElementById("filterContainer")!.style.display = "block";
          setTimeout(() => {
            document
              .getElementById("filters")!
              .classList.add(filterStyles.active);
          }, 0);
        }}
      >
        ▶
      </button>
      <div className={filterStyles.filterContainer} id="filterContainer">
        <div className={filterStyles.filters} id="filters">
          <div className={filterStyles.heading}>
            <p></p>
            <h2>Filters</h2>
            <button
              onClick={() => {
                document
                  .getElementById("filters")!
                  .classList.remove(filterStyles.active);
                setTimeout(() => {
                  document.getElementById("filterContainer")!.style.display =
                    "none";
                }, 700);
              }}
            >
              ✗
            </button>
          </div>
          <button onClick={() => setNameFilter(!nameFilter)}>
            <p></p>
            <h3>Name</h3>
            <p>{nameFilter ? "▴" : "▾"}</p>
          </button>
          {nameFilter && (
            <input
              type="text"
              name="filterName"
              id="filterName"
              placeholder="e.g. Lionel Messi"
            />
          )}
          <button onClick={() => setLevelFilter(!levelFilter)}>
            <p></p>
            <h3>Level</h3>
            <p>{levelFilter ? "▴" : "▾"}</p>
          </button>
          {levelFilter && (
            <div>
              <div>
                <span className={filterStyles.tag}>Min</span>
                <input
                  type="number"
                  name="filterMinLevel"
                  id="filterMinLevel"
                />
                <span className={filterStyles.unit}></span>
              </div>
              <div>
                <span className={filterStyles.tag}>Max</span>
                <input
                  type="number"
                  name="filterMaxLevel"
                  id="filterMaxLevel"
                />
                <span className={filterStyles.unit}></span>
              </div>
            </div>
          )}
          {priceEnabled && (
            <>
              <button onClick={() => setPriceFilter(!priceFilter)}>
                <p></p>
                <h3>Price</h3>
                <p>{priceFilter ? "▴" : "▾"}</p>
              </button>
              {priceFilter && (
                <div>
                  <div>
                    <span className={filterStyles.tag}>Min</span>
                    <input
                      type="number"
                      name="filterMinPrice"
                      id="filterMinPrice"
                    />
                    <span className={filterStyles.unit}>MATIC</span>
                  </div>
                  <div>
                    <span className={filterStyles.tag}>Max</span>
                    <input
                      type="number"
                      name="filterMaxPrice"
                      id="filterMaxPrice"
                    />
                    <span className={filterStyles.unit}>MATIC</span>
                  </div>
                </div>
              )}
            </>
          )}
          <button
            onClick={async () => {
              const nameElement = document.getElementById(
                "filterName"
              ) as HTMLInputElement;
              const name = nameElement ? nameElement.value : "";
              const minLevelElement = document.getElementById(
                "filterMinLevel"
              ) as HTMLInputElement;
              const maxLevelElement = document.getElementById(
                "filterMaxLevel"
              ) as HTMLInputElement;
              const minPriceElement = document.getElementById(
                "filterMinPrice"
              ) as HTMLInputElement;
              const maxPriceElement = document.getElementById(
                "filterMaxPrice"
              ) as HTMLInputElement;
              let minLevel = minLevelElement
                ? parseInt(minLevelElement.value)
                : 0;
              let maxLevel = maxLevelElement
                ? parseInt(maxLevelElement.value)
                : 0;
              if ((minLevel > maxLevel && !isNaN(maxLevel)) || minLevel < 0) {
                minLevel = 0;
                minLevelElement.value = minLevel.toString();
              }
              if (isNaN(minLevel)) {
                minLevel = 0;
              }
              if (isNaN(maxLevel)) {
                maxLevel = 0;
              }
              if (maxLevel < 0) {
                maxLevel = 0;
                maxLevelElement.value = maxLevel.toString();
              }
              let minPrice = minPriceElement
                ? parseFloat(minPriceElement.value)
                : 0;
              let maxPrice = maxPriceElement
                ? parseFloat(maxPriceElement.value)
                : 0;
              if ((maxPrice < minPrice && !isNaN(maxPrice)) || minPrice < 0) {
                minPrice = 0;
                minPriceElement.value = minPrice.toString();
              }
              if (isNaN(maxPrice)) {
                maxPrice = 0;
              }
              if (isNaN(minPrice)) {
                minPrice = 0;
              }
              if (maxPrice < 0) {
                maxPrice = 0;
                maxPriceElement.value = maxPrice.toString();
              }
              handleClick(name, minLevel, maxLevel, minPrice, maxPrice);
            }}
            className={filterStyles.apply}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
