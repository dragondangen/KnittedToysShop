using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToysController : ControllerBase
{
    private readonly IToyService _toyService;
    public ToysController(IToyService toyService)
    {
        _toyService = toyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var toys = await _toyService.GetAllToysAsync();
        return Ok(toys);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var toy = await _toyService.GetByIdAsync(id);
        if (toy == null)
        {
            return NotFound();
        }
        return Ok(toy);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Toy toy)
    {
        if (toy == null || string.IsNullOrEmpty(toy.Name) || toy.Price <= 0)
        {
            return BadRequest("Неверные данные игрушки");
        }
        await _toyService.AddToyAsync(toy);
        return CreatedAtAction(nameof(GetById), new { id = toy.Id }, toy);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Toy toy)
    {
        if (toy == null || toy.Id != id || string.IsNullOrEmpty(toy.Name) || toy.Price <= 0)
        {
            return BadRequest("Неверные данные игрушки или несоответствие ID");
        }
        var existingToy = await _toyService.GetByIdAsync(id);
        if (existingToy == null)
        {
            return NotFound();
        }
        await _toyService.UpdateToyAsync(toy);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var toy = await _toyService.GetByIdAsync(id);
        if (toy == null)
        {
            return NotFound();
        }
        await _toyService.DeleteToyAsync(id);
        return NoContent();
    }
}